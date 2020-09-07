import { colorNME } from '../shaders/colorNME'
import { addErasable, addSPSEvents } from '../utils/behaviors'
import { blockMesh } from '../utils/meshGenerator'
import { blankBlock } from '../content/models'
const {
    Vector3, MeshBuilder
} = BABYLON

const DegreesToRadians = (degrees) => degrees / 57.2958

export async function setup(blockObject, ctx) {
    const { scene, engine, xrDefault } = ctx
    // * Base
    const baseMesh = MeshBuilder.CreateCylinder('Island', { height: 1, diameter: 0.4 }, scene)
    baseMesh.checkCollisions = true
    baseMesh.position = new Vector3(0, 0.5, 0)

    // * Sculpture blank
    // First create the SPS
    const solutionMesh = blockMesh(blockObject, scene)
    solutionMesh.material = colorNME()
    solutionMesh.position = new Vector3(-1, 1.5, 0)

    const mesh = blockMesh(blankBlock, scene)
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
}
