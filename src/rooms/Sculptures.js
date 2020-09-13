/* eslint-disable complexity */
import { colorNME, colorNMEColors } from '../shaders/colorNME'
import { addErasable, addSPSEvents, addGrabbable } from '../utils/behaviors'
import {
    blockMesh, textPanelMesh, createColorMaterial, startButtonMesh
} from '../utils/meshGenerator'
import { blankBlock } from '../content/models'
import constants from '../utils/constants'

const {
    Vector3, Mesh, MeshBuilder, StandardMaterial, Color3
} = BABYLON

const humanReadableTimer = (time) => {
    let result = ''
    const minutes = Math.floor(time / (60))
    result += `${minutes}:`
    const seconds = Math.floor(time - (minutes * 60))
    result += `${seconds.toString().padStart(2, '0')}`
    return result
}

export async function setup(blockObject, ctx) {
    const redColorMaterial = createColorMaterial(new Color3(1.0, 0, 0))
    ctx.sculptures.push(blockObject.name)
    let colorMaterial
    if (blockObject.colors) {
        const colors = blockObject.colors.map((color) => {
            const colorArray = color.split(',')
            return new Color3.FromInts(colorArray[0], colorArray[1], colorArray[2])
        })
        colorMaterial = colorNMEColors(colors)
    } else {
        colorMaterial = colorNME()
    }
    const {
        scene, engine, xrHelper, xrDefault, myStorage
    } = ctx
    // * The parent mesh
    const parentMesh = new Mesh(blockObject.name, scene)
    parentMesh.metadata = {
        inProgress: false,
        timer: 0,
        counter: 0,
        myStorage
    }
    parentMesh.startGame = function() {
        const { sculpture, solution, myStorage } = this.metadata
        const sps = sculpture.metadata.sps
        for (let i = 0; i < sps.nbParticles; i++) {
            const particle = sps.particles[i]
            particle.scaling = Vector3.One()
            particle.props.state = 1
            particle.materialIndex = 0
        }
        sps.setParticles()
        sps.computeSubMeshes()
        this.metadata.inProgress = true
        this.metadata.timer = constants.maxTime
        solution.parent.scaling = Vector3.One()

        // Attach the solution mesh to any motion controller
        xrDefault.input.controllers.forEach((controller) => {
            if (controller.motionController && controller.motionController.rootMesh) {
                // Remove old solution boxes
                controller.motionController.rootMesh.getChildMeshes(true).forEach((child) => {
                    if (child.name.includes('Solution-Box')) {
                        child.scaling = Vector3.Zero()
                        child.setParent(null)
                    }
                })

                const solutionBox = scene.getMeshByName(`${blockObject.name}-Solution-Box`)
                solutionBox.scaling = new Vector3(0.25, 0.25, 0.25)
                solutionBox.setParent(controller.motionController.rootMesh)
                solutionBox.position = new Vector3(0, 0.05, -0.05)
                solutionBox.rotation = new Vector3(Math.PI / 4, Math.PI, 0)
            }
        })

        // CAT ONLY STUFF BEWARE
        if (this.name !== 'Cat') return
        this.getChildMeshes(true).forEach((child) => {
            if (child.name === 'Tutorial-Mesh') child.dispose()
            if (child.name === 'Tutorial-Lines') child.dispose()
        })
        if (myStorage.isSupported && !myStorage.get('Cat')) {
            const tutorialMesh = textPanelMesh({ width: 960 }, scene)
            tutorialMesh.setParent(parentMesh)
            tutorialMesh.setText('Aim the laser at the|sculpture and click|to chip away blocks')
            tutorialMesh.position = new Vector3(-1, 1, -0.5)
            tutorialMesh.name = 'Tutorial-Mesh'
            tutorialMesh.billboardMode = Mesh.BILLBOARDMODE_Y
            const lines = MeshBuilder.CreateLines('Tutorial-Lines2', {
                points: [
                    new Vector3(-1, 1.15, -0.5),
                    new Vector3(-0.25, 1.25, -0.2)
                ],
                colors: [
                    new BABYLON.Color4(0, 0, 0, 1),
                    new BABYLON.Color4(0, 0, 0, 1)
                ],
                useVertexAlpha: false
            }, scene)
            lines.locallyTranslate(parentMesh.position)
            lines.setParent(parentMesh)
        }
    }
    parentMesh.endGame = function() {
        this.metadata.inProgress = false
        const {
            sculpture, solution, percent, mistakes, timer
        } = this.metadata
        const sps = sculpture.metadata.sps
        const particleExport = []
        for (let i = 0; i < sps.nbParticles; i++) {
            const particle = sps.particles[i]
            particleExport.push(particle.props.state)
        }

        if (myStorage.isSupported) {
            const sculptureString = ctx.myStorage.get(parentMesh.name)
            let betterScore = false
            if (!sculptureString || sculptureString.split('|').length < 4) {
                betterScore = true
            } else {
                const [particles, highPercent, lowMistakes, timerRemaining] = sculptureString.split('|')
                if (percent > parseInt(highPercent, 10)) {
                    betterScore = true
                }
                if (percent === 100 && mistakes < parseInt(lowMistakes, 10)) {
                    betterScore = true
                }
                if (percent === 100 && mistakes === 0 && timer > timerRemaining) {
                    betterScore = true
                }
            }

            if (betterScore) {
                myStorage.set(parentMesh.name, `${particleExport.join('')}|${percent}|${mistakes}|${Math.floor(timer)}`)
            }
        }
        solution.parent.scaling = Vector3.Zero()
    }
    // * Base
    const baseMesh = MeshBuilder.CreateBox('Pedestal', { height: 1.3, width: 0.4, depth: 0.4 }, scene)
    baseMesh.checkCollisions = true
    baseMesh.position = new Vector3(0, 0.6, 0)

    // * The solution
    const solutionMesh = blockMesh(blockObject, null, scene)
    solutionMesh.metadata.sps.setMultiMaterial([colorMaterial, redColorMaterial])
    // solutionMesh.material = colorNME()
    solutionMesh.position = new Vector3(-1, 1.5, 0)
    solutionMesh.scaling = new Vector3(0.5, 0.5, 0.5)
    parentMesh.metadata.solution = solutionMesh
    // The solution's box
    const solutionBox = MeshBuilder.CreateBox(`${blockObject.name}-Solution-Box`, { size: 0.51 }, scene)
    solutionBox.isPickable = false
    solutionBox.position = new Vector3(-1, 1.5, 0)
    solutionBox.material = new StandardMaterial('box')
    solutionBox.material.alpha = 0.5

    const helperBox = solutionBox.clone(`${blockObject.name}-Helper-Box`)
    helperBox.isPickable = false
    helperBox.position.x = 0

    solutionMesh.setParent(solutionBox)
    // addGrabbable(solutionBox)

    // The blank canvas
    const mesh = blockMesh(blankBlock, solutionMesh.metadata.sps.particles, scene)
    mesh.metadata.sps.setMultiMaterial([colorMaterial, redColorMaterial])
    // If there's one stored in localstorage, do that one
    if (myStorage.isSupported) {
        const sculptureString = myStorage.get(parentMesh.name)
        if (sculptureString) {
            const [particleString, percent, mistakes, timer] = sculptureString.split('|')
            parentMesh.metadata.percent = percent
            parentMesh.metadata.mistakes = mistakes
            parentMesh.metadata.timer = timer
            // Hide the solution
            solutionMesh.parent.scaling = Vector3.Zero()
            const particleImport = particleString.split('')
            const blankSps = mesh.metadata.sps
            for (let i = 0; i < blankSps.nbParticles; i++) {
                const state = parseInt(particleImport[i], 10)
                blankSps.particles[i].props.state = state
                const { correctState } = blankSps.particles[i].props
                blankSps.particles[i].scaling = (state === 1 || correctState === 1) ? Vector3.One() : Vector3.Zero()
                blankSps.particles[i].materialIndex = (state === 0 && correctState === 1) ? 1 : 0
            }
            blankSps.computeSubMeshes()
            blankSps.setParticles()
        }
    }
    mesh.scaling = new Vector3(0.5, 0.5, 0.5)
    mesh.position = new Vector3(0, 1.5, 0)
    parentMesh.metadata.sculpture = mesh

    // Add events for the sps and particles
    addSPSEvents(mesh)
    mesh.metadata.parent = parentMesh
    const sps = mesh.metadata.sps
    for (let i = 0; i < sps.nbParticles; i++) {
        const particle = sps.particles[i]
        addErasable(particle)
    }
    sps.setParticles()

    // Info Panel
    const infoPanel = textPanelMesh({}, scene)
    infoPanel.rotate(Vector3.Right(), Math.PI / 8)
    infoPanel.position = new Vector3(0, 1, -0.3)
    infoPanel.scaling = new Vector3(0.7, 0.7, 0.7)
    scene.registerBeforeRender(() => {
        let { timer, counter, inProgress } = parentMesh.metadata
        const dt = engine.getDeltaTime() / 1000
        timer = Math.max(0, timer - dt)
        counter -= 1
        if (inProgress && timer === 0) { // Time's up
            parentMesh.endGame()
        }
        if (counter <= 0) { // Only update 1/s
            let text = (timer > 0) ? `${humanReadableTimer(timer)}` : `${blockObject.name}`
            const solutionParticles = solutionMesh.metadata.sps
            const sculptureParticles = mesh.metadata.sps
            let correct = 0
            let total = 0
            let mistakes = 0
            for (let i = 0; i < solutionParticles.nbParticles; i++) {
                if (solutionParticles.particles[i].props.state === 0) { // Should be empty
                    total += 1
                    if (sculptureParticles.particles[i].props.state === 0) { // Is empty
                        correct += 1
                    }
                } else if (sculptureParticles.particles[i].props.state === 0) { // Should be filled and Is not filled
                    mistakes += 1
                }
            }
            const percent = Math.floor((correct / total) * 100)
            text += `|${percent}%`
            if (mistakes) {
                text += `|${mistakes} ${(mistakes === 1) ? 'mistake' : 'mistakes'}`
            }
            infoPanel.setText(text)
            counter = constants.percentUpdateFrames
            if (percent === 100) {
                zzfx(1, 0.05, 597, 0.34, 0.22, 0.42, 0, 0.71, -5.2, 0, 9, 0.08, 0.2, 0, 0, 0, 0, 0.59, 0.09, 0.14) // Powerup 42
                parentMesh.endGame(percent, mistakes)
            }
            parentMesh.metadata.percent = percent
            parentMesh.metadata.mistakes = mistakes
            parentMesh.metadata.timer = timer
        }
        parentMesh.metadata.timer = timer
        parentMesh.metadata.counter = counter
    })
    infoPanel.setParent(baseMesh)

    // Buttons
    // TODO: Turn left/right buttons

    // Start/reset button
    const startButton = startButtonMesh(scene)
    // const startButton = MeshBuilder.CreateBox('Start-Button', { size: 0.25 }, scene)
    startButton.position = new Vector3(0, 0.25, -0.10)
    startButton.startInteraction = () => {
        parentMesh.startGame()
        startButton.scaling = new Vector3(0.9, 0.9, 1)
        zzfx(1, 0.05, 239, 0.04, 0.09, 0.29, 0, 0.99, -0.9, 0, 0, 0, 0, 0, 0, 0.1, 0.05, 0.91, 0.08, 0) // Jump 31
    }
    startButton.endInteraction = () => {
        startButton.scaling = Vector3.One()
    }
    startButton.setParent(baseMesh)

    if (blockObject.name === 'Cat' && myStorage && !myStorage.get('Cat')) {
        // Add tutorial textMeshes
        const tutorialMesh = textPanelMesh({ width: 960 }, scene)
        tutorialMesh.setText('Aim the laser and |click the trigger|to reset and start timer')
        tutorialMesh.position = new Vector3(1, 1, -0.5)
        tutorialMesh.name = 'Tutorial-Mesh'
        tutorialMesh.billboardMode = Mesh.BILLBOARDMODE_Y
        const lines = MeshBuilder.CreateLines('Tutorial-Lines', {
            points: [
                tutorialMesh.position,
                new Vector3(0, 0.25, -0.2)
            ],
            colors: [
                new BABYLON.Color4(0, 0, 0, 1),
                new BABYLON.Color4(0, 0, 0, 1)
            ],
            useVertexAlpha: false
        }, scene)
        lines.setParent(parentMesh)
        tutorialMesh.setParent(parentMesh)
    } else if (blockObject.name === 'Skull') {
        mesh.scaling = new Vector3(2.2, 2.2, 2.2)
        mesh.position = new Vector3(0, 1.1, 3)
        baseMesh.position.x = -2
        solutionBox.position.x = -2
        helperBox.dispose()
    } else if (blockObject.name === 'Ship') {
        mesh.scaling = new Vector3(8, 8, 8)
        mesh.position = new Vector3(0, 4, 8)
        baseMesh.position.x = -2
        solutionBox.position.x = -2
        helperBox.dispose()
    } else if (blockObject.name === 'Links') {
        mesh.scaling = new Vector3(2.2, 2.2, 2.2)
        mesh.position = new Vector3(0, 0.88, 3)
        baseMesh.position.x = -2
        solutionBox.position.x = -2
        helperBox.dispose()
    }

    // Put it all together
    baseMesh.setParent(parentMesh)
    solutionBox.setParent(parentMesh)
    helperBox.setParent(parentMesh)
    mesh.setParent(parentMesh)
    // Might want to move this up a level
    return parentMesh
}
