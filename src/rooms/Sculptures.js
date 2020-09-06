import { colorNME } from '../shaders/colorNME'
import { addGrabbable, addErasable, addSPSEvents } from '../utils/behaviors'
import { intersectDrawings } from '../utils/meshGenerator'
import { cat } from '../content/models'
const {
    Animation, Color3, Vector3, Mesh, Space, MeshBuilder, SolidParticleSystem
} = BABYLON

const SCULPTURE_WIDTH = 10
const SCULPTURE_HEIGHT = 10
const SCULPTURE_DEPTH = 10
const BOX_SIZE = 0.1

const DegreesToRadians = (degrees) => degrees / 57.2958

export async function setup(ctx) {
    const { scene, engine, xrDefault } = ctx
    // * Base
    const baseMesh = MeshBuilder.CreateCylinder('Island', { height: 1, diameter: 0.4 }, scene)
    baseMesh.checkCollisions = true
    baseMesh.position = new Vector3(0, 0.5, 0)

    // * Sculpture blank
    // First create the SPS
    const SPS = new SolidParticleSystem('SPS', scene, { isPickable: true })
    const box = MeshBuilder.CreateBox('b', { size: BOX_SIZE }, scene)
    SPS.addShape(box, SCULPTURE_WIDTH * SCULPTURE_HEIGHT * SCULPTURE_DEPTH) // 20 spheres
    box.dispose()
    const sculptureMesh = SPS.buildMesh() // finally builds and displays the real mesh
    sculptureMesh.metadata = { sps: SPS }
    sculptureMesh.position.y = 1

    SPS.initParticles = function() {
        for (let i = 0; i < SPS.nbParticles; i++) {
            const particle = SPS.particles[i]
            particle.props = { on: true }
            // Set the initial position
            particle.position = new Vector3(
                BOX_SIZE * (i % SCULPTURE_WIDTH - 0.5 * SCULPTURE_WIDTH),
                BOX_SIZE * (Math.floor(i / SCULPTURE_HEIGHT) % SCULPTURE_HEIGHT),
                BOX_SIZE * Math.floor(i / SCULPTURE_WIDTH / SCULPTURE_HEIGHT - 0.5 * SCULPTURE_DEPTH)
            )
            addErasable(particle)
        }
    }
    addSPSEvents(sculptureMesh)

    SPS.initParticles()
    SPS.setParticles()
    SPS.refreshVisibleSize() // force the BBox recomputation

    // Teleport Pad
    const snapPoint = MeshBuilder.CreateBox('SnapPoint', { height: 0.01, width: 1, depth: 1 }, scene)
    snapPoint.position = new Vector3(0, 0.01, -1)
    xrDefault.teleportation.addSnapPoint(snapPoint.position)

    // Hologram
    const catMesh = intersectDrawings(cat)
    catMesh.position = new Vector3(0, 1.5, 0)
}
