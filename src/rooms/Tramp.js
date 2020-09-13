import { intersectDrawings, textPanelMesh } from '../utils/meshGenerator'
import { wave } from '../content/models.js'

const {
    Animation, Color3, Vector3, MeshBuilder, Mesh, Space
} = BABYLON

const DegreesToRadians = (degrees) => degrees / 57.2958

const startNewWave = function () {
    const r = 50 * Math.random() + 20
    const a = Math.random() * 2 * Math.PI
    this.position = new Vector3(r * Math.cos(a), 0, r * Math.sin(a))
    this.getScene().beginAnimation(
        this,
        0,
        50,
        Animation.ANIMATIONLOOPMODE_RELATIVE,
        Math.random() * 1 + 1, // speed
        startNewWave.bind(this)
    )
}

export async function setup(ctx) {
    const { scene, engine } = ctx
    const parentMesh = new Mesh('Tramp-Game-Mesh', scene)

    const trampMesh = MeshBuilder.CreateCylinder('Tramp-Mesh', { diameter: 2, height: 0.25}, scene)
    trampMesh.position.y = 0.125
    trampMesh.setParent(parentMesh)

    const jumperMesh = MeshBuilder.CreateBox('Jumper-Mesh', { width: 0.25, depth: 0.25, height: 1 }, scene)
    jumperMesh.position.y = 0.625
    jumperMesh.setParent(parentMesh)
    jumperMesh.acceleration = -9.8 // m/s^2
    jumperMesh.velocity = 4.9
    jumperMesh.rotationalVelocity = 1.5 * Math.PI
    scene.registerBeforeRender(() => {
        const dt = engine.getDeltaTime() / 1000
        // Update position
        jumperMesh.position.y += jumperMesh.velocity * dt
        // Update velocity
        jumperMesh.velocity += jumperMesh.acceleration * dt
        if (jumperMesh.position.y - 0.5 <= trampMesh.position.y) {
            // Make sure it's a valid rotation
            jumperMesh.velocity = Math.abs(jumperMesh.velocity)
            // TODO: If it's a bad rotation, fly off for a few seconds, then reset everything
            // TODO: Note how perfect the landing is
        }

        // Update rotation
        if (jumperMesh.spinning) {
            jumperMesh.rotate(Vector3.Forward(), jumperMesh.rotationalVelocity * dt)
        }
    })

    const buttonMesh = MeshBuilder.CreateBox('Rotate-Button', { size: 0.50 }, scene)
    buttonMesh.position = new Vector3(-1, 0.25, -1)
    buttonMesh.startInteraction = (pointerInfo, controllerMesh, ctx) => {
        jumperMesh.spinning = true
    }

    buttonMesh.endInteraction = () => {
        jumperMesh.spinning = false
    }
    buttonMesh.setParent(parentMesh)

    // Scoreboard
    // Current streak, current flips
    // Max streak, max flips
    
    
    return parentMesh
}
