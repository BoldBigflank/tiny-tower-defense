import { colorNME } from '../shaders/colorNME'
import { addErasable, addSPSEvents, addGrabbable } from '../utils/behaviors'
import { blockMesh, textPanelMesh } from '../utils/meshGenerator'
import { blankBlock } from '../content/models'
import constants from '../utils/constants'
import { Storage } from '../utils/Storage'

const {
    Vector3, Mesh, MeshBuilder, StandardMaterial
} = BABYLON

export async function setup(blockObject, ctx) {
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
            particle.props.on = true
        }
        sps.setParticles()
        this.metadata.inProgress = true
        this.metadata.timer = constants.maxTime
        solution.parent.scaling = Vector3.One()

    }
    parentMesh.endGame = function() {
        console.log('endGame')
        this.metadata.inProgress = false
        // TODO: Save the particles to localstorage
        const { sculpture, solution } = this.metadata
        const sps = sculpture.metadata.sps
        const particleExport = []
        for (let i = 0; i < sps.nbParticles; i++) {
            const particle = sps.particles[i]
            particleExport.push((particle.props.on) ? 1 : 0)
        }

        if (myStorage.isSupported) myStorage.set(parentMesh.name, particleExport.join(''))
        solution.parent.scaling = Vector3.Zero()
    }
    // * Base
    const baseMesh = MeshBuilder.CreateBox('Pedestal', { height: 1.25, width: 0.4, depth: 0.4 }, scene)
    baseMesh.checkCollisions = true
    baseMesh.position = new Vector3(0, 1.25 / 2, 0)

    // * The solution
    const solutionMesh = blockMesh(blockObject, scene)
    solutionMesh.material = colorNME()
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
    const mesh = blockMesh(blankBlock, scene)
    // If there's one stored in localstorage, do that one
    if (myStorage.isSupported) {
        const particleString = myStorage.get(parentMesh.name)
        if (particleString) {
            // Hide the solution
            solutionMesh.parent.scaling = Vector3.Zero()
            const particleImport = particleString.split('')
            const blankSps = mesh.metadata.sps
            for (let i = 0; i < blankSps.nbParticles; i++) {
                const on = parseInt(particleImport[i], 10) === 1
                blankSps.particles[i].props.on = on
                blankSps.particles[i].scaling = (on) ? Vector3.One() : Vector3.Zero()
            }
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
        // console.log('timer', timer)
        const dt = engine.getDeltaTime() / 1000
        timer = Math.max(0, timer - dt)
        counter -= 1
        if (inProgress && timer === 0) { // Time's up
            parentMesh.endGame()
        }
        if (counter <= 0) { // Only update 1/s
            let text = `${blockObject.name}|`
            if (timer > 0) {
                text += `${Math.ceil(timer)}|`
            }
            const solutionParticles = solutionMesh.metadata.sps
            const sculptureParticles = mesh.metadata.sps
            let correct = 0
            let total = 0
            for (let i = 0; i < solutionParticles.nbParticles; i++) {
                if (!solutionParticles.particles[i].props.on) {
                    total += 1
                    if (!sculptureParticles.particles[i].props.on) {
                        correct += 1
                    }
                }
            }
            text += `${Math.floor((correct / total) * 100)}%`
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
