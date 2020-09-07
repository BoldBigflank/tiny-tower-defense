import { colorNME } from '../shaders/colorNME'
import { addErasable, addSPSEvents, addGrabbable } from '../utils/behaviors'
import { blockMesh } from '../utils/meshGenerator'
import { blankBlock } from '../content/models'
const {
    Vector3, MeshBuilder, StandardMaterial
} = BABYLON

export async function setup(blockObject, ctx) {
    const { scene, engine, xrDefault } = ctx
    // * Base
    const baseMesh = MeshBuilder.CreateBox('Pedestal', { height: 1.25, width: 0.4, depth: 0.4 }, scene)
    baseMesh.checkCollisions = true
    baseMesh.position = new Vector3(0, 1.25 / 2, 0)

    // * The solution
    const solutionMesh = blockMesh(blockObject, scene)
    solutionMesh.material = colorNME()
    solutionMesh.position = new Vector3(-1, 1.5, 0)
    solutionMesh.scaling = new Vector3(0.5, 0.5, 0.5)

    const box = MeshBuilder.CreateBox('Helper-Box', {size: 0.51}, scene)
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
    mesh.scaling = new Vector3(0.5, 0.5, 0.5)
    mesh.position = new Vector3(0, 1.5, 0)

    // Add events for the sps and particles
    addSPSEvents(mesh)
    const sps = mesh.metadata.sps
    for (let i = 0; i < sps.nbParticles; i++) {
        const particle = sps.particles[i]
        addErasable(particle)
    }
    sps.setParticles()

    // Teleport Pad
    const snapPoint = MeshBuilder.CreateBox('SnapPoint', { height: 0.01, width: 1, depth: 1 }, scene)
    snapPoint.position = new Vector3(0, 0.01, -1)
    xrDefault.teleportation.addSnapPoint(snapPoint.position)

    // Buttons
    // TODO: Turn left/right buttons
    // TODO: Start/reset button
    // TODO: Display with timer/percent
}
