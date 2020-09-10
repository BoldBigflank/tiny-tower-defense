import { colorNME } from '../shaders/colorNME'
import { addErasable, addSPSEvents, addGrabbable } from '../utils/behaviors'
import { blockMesh, textPanelMesh, createColorMaterial } from '../utils/meshGenerator'
import { blankBlock } from '../content/models'
import constants from '../utils/constants'
import { Storage } from '../utils/Storage'

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
    const colorMaterial = colorNME()

    const myStorage = new Storage()
    const { scene, engine } = ctx
    // * The parent mesh
    const parentMesh = new Mesh(blockObject.name, scene)
    parentMesh.metadata = {
        inProgress: false,
        timer: 0,
        counter: 0
    }
    parentMesh.startGame = function() {
        const { sculpture, solution } = this.metadata
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
    }
    parentMesh.endGame = function() {
        this.metadata.inProgress = false
        // TODO: Save the particles to localstorage
        const { sculpture, solution } = this.metadata
        const sps = sculpture.metadata.sps
        const particleExport = []
        for (let i = 0; i < sps.nbParticles; i++) {
            const particle = sps.particles[i]
            particleExport.push(particle.props.state)
        }

        if (myStorage.isSupported) myStorage.set(parentMesh.name, particleExport.join(''))
        solution.parent.scaling = Vector3.Zero()
    }
    // * Base
    const baseMesh = MeshBuilder.CreateBox('Pedestal', { height: 1.25, width: 0.4, depth: 0.4 }, scene)
    baseMesh.checkCollisions = true
    baseMesh.position = new Vector3(0, 1.25 / 2, 0)

    // * The solution
    const solutionMesh = blockMesh(blockObject, null, scene)
    solutionMesh.metadata.sps.setMultiMaterial([colorNME(), redColorMaterial])
    // solutionMesh.material = colorNME()
    solutionMesh.position = new Vector3(-1, 1.5, 0)
    solutionMesh.scaling = new Vector3(0.5, 0.5, 0.5)
    parentMesh.metadata.solution = solutionMesh
    // The solution's box
    const box = MeshBuilder.CreateBox('Helper-Box', { size: 0.51 }, scene)
    box.position = new Vector3(-1, 1.5, 0)
    box.material = new StandardMaterial('box')
    box.material.alpha = 0.5
    
    const box2 = box.clone('Helper-Box2')
    box2.isPickable = false
    box2.position.x = 0
    
    solutionMesh.setParent(box)
    addGrabbable(box)

    // The blank canvas
    const mesh = blockMesh(blankBlock, solutionMesh.metadata.sps.particles, scene)
    mesh.metadata.sps.setMultiMaterial([colorMaterial, redColorMaterial, redColorMaterial])
    // If there's one stored in localstorage, do that one
    if (myStorage.isSupported) {
        const particleString = myStorage.get(parentMesh.name)
        if (particleString) {
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
    // TODO: Load the stored particles from localStorage
    for (let i = 0; i < sps.nbParticles; i++) {
        const particle = sps.particles[i]
        addErasable(particle)
    }
    sps.setParticles()

    // Info Panel
    const infoPanel = textPanelMesh('Hello', scene)
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
            text += `|${Math.floor((correct / total) * 100)}%`
            if (mistakes) {
                text += `|${mistakes} ${(mistakes === 1) ? 'mistake' : 'mistakes'}`
            } 
            // TODO: Count and display mistakes
            infoPanel.updateText(text)
            counter = constants.percentUpdateFrames
        }
        parentMesh.metadata.timer = timer
        parentMesh.metadata.counter = counter
    })

    // Buttons
    // TODO: Turn left/right buttons

    // Start/reset button
    const startButton = MeshBuilder.CreateBox('Start-Button', { size: 0.25 }, scene)
    startButton.position = new Vector3(0, 0.25, -0.25)
    startButton.startInteraction = () => {
        parentMesh.startGame()
    }

    // Put it all together
    baseMesh.setParent(parentMesh)
    box.setParent(parentMesh)
    box2.setParent(parentMesh)
    infoPanel.setParent(parentMesh)
    mesh.setParent(parentMesh)
    startButton.setParent(parentMesh)
    // Might want to move this up a level
    return parentMesh
}
