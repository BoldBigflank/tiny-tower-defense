/* eslint-disable complexity */
import { createColorMaterial, textPanelMesh } from '../utils/meshGenerator'

const {
    Color3, Vector3, MeshBuilder, Mesh, Space
} = BABYLON

const DegreesToRadians = (degrees) => degrees / 57.2958

export async function setup(ctx) {
    const { scene, engine } = ctx
    const parentMesh = new Mesh('Tramp-Game-Mesh', scene)

    const trampMesh = MeshBuilder.CreateCylinder('Tramp-Mesh', { diameter: 2, height: 0.25 }, scene)
    trampMesh.position.y = 0.125
    trampMesh.setParent(parentMesh)

    const trampScoreMesh = textPanelMesh({ width: 800, height: 300 }, scene)
    trampScoreMesh.name = 'Tramp-Score-Mesh'
    trampScoreMesh.position = new Vector3(0, 3.5, 0.5)
    trampScoreMesh.scaling = new Vector3(2, 2, 1)
    trampScoreMesh.setParent(parentMesh)

    const jumperMesh = MeshBuilder.CreateBox('Jumper-Mesh', { width: 0.25, depth: 0.25, height: 1 }, scene)
    jumperMesh.material = createColorMaterial(Color3.Black())
    jumperMesh.setParent(parentMesh)
    jumperMesh.resetFalling = function() {
        jumperMesh.position = new Vector3(0, 0.625, 0)
        jumperMesh.rotation = Vector3.Zero()
        // jumperMesh.position.y = 0.625
        jumperMesh.velocity = 9.8
        jumperMesh.acceleration = -9.8
        jumperMesh.rotationalVelocity = 2 * Math.PI
        jumperMesh.flips = 0
        jumperMesh.streak = 0
        jumperMesh.lastZ = 0
    }
    jumperMesh.startFalling = function() {
        zzfx(1, .05, 80, 0, .02, .39, 3, 1.35, 0, 0, 0, 0, 0, .2, 0, .1, 0, .99, .05, 0); // Hit 54
        jumperMesh.falling = 60
        const direction = (jumperMesh.up.y >= 0) ? 1 : -1
        jumperMesh.spinning = false
    }
    jumperMesh.resetFalling()
    jumperMesh.maxFlips = parseInt(ctx.myStorage.get('tramp-flips') || 0, 10)
    jumperMesh.maxStreak = parseInt(ctx.myStorage.get('tramp-streak') || 0, 10)
    scene.registerBeforeRender(() => {
        const dt = engine.getDeltaTime() / 1000
        // Update position
        if (jumperMesh.falling) {
            const direction = (jumperMesh.up.y >= 0) ? -1 : 1
            jumperMesh.locallyTranslate(new Vector3(0, direction * jumperMesh.velocity * dt, 0))
            jumperMesh.falling -= 1
            if (jumperMesh.falling === 0) {
                // reset
                jumperMesh.resetFalling()
            }
        } else {
            jumperMesh.position.y += jumperMesh.velocity * dt
            const z = (jumperMesh.rotationQuaternion) ? jumperMesh.rotationQuaternion.toEulerAngles().z : jumperMesh.rotation.z
            if (jumperMesh.lastZ > z) {
                jumperMesh.flips += 1
            }
            jumperMesh.lastZ = z
            if (jumperMesh.position.y - 0.5 <= trampMesh.position.y) {
                // Make sure it's a valid rotation
                if (z < DegreesToRadians(-25) || z > DegreesToRadians(25)) {
                    jumperMesh.startFalling()
                } else {
                    if (jumperMesh.interacted) {
                        zzfx(1, .05, 178, .05, 0, .11, 0, 1.14, 4.2, 3.5, 0, 0, 0, 0, 0, .1, 0, .76, .1, 0); // Jump 45
                    }
                    jumperMesh.position.y = trampMesh.position.y + 0.5
                    jumperMesh.velocity = Math.max(Math.abs(jumperMesh.velocity), 9.8)
                    if (jumperMesh.flips > 0) jumperMesh.velocity += 1.8
                    jumperMesh.streak = (jumperMesh.flips > 0) ? jumperMesh.streak + 1 : 0
                    if (jumperMesh.streak > jumperMesh.maxStreak) {
                        jumperMesh.maxStreak = jumperMesh.streak
                        ctx.myStorage.set('tramp-streak', jumperMesh.streak)
                    }
                    if (jumperMesh.flips > jumperMesh.maxFlips) {
                        jumperMesh.maxFlips = jumperMesh.flips
                        ctx.myStorage.set('tramp-flips', jumperMesh.flips)
                    }
                    jumperMesh.flips = 0
                }
            }
            // Update velocity
            jumperMesh.velocity += jumperMesh.acceleration * dt
            // Update rotation
            if (jumperMesh.spinning) {
                jumperMesh.rotate(Vector3.Forward(), jumperMesh.rotationalVelocity * dt)
            }
            // Update the scoreboard
            trampScoreMesh.setText(`Flips: ${jumperMesh.flips}^Max:${jumperMesh.maxFlips}|Streak:${jumperMesh.streak}^Max:${jumperMesh.maxStreak}`)
        }
    })

    const jumperHead = MeshBuilder.CreateBox('Jumper-Head', { width: 0.4, depth: 0.4, height: 0.4 }, scene)
    jumperHead.material = createColorMaterial(Color3.FromInts(254, 149, 1))
    jumperHead.position.y = 1
    jumperHead.setParent(jumperMesh)

    const buttonMesh = MeshBuilder.CreateBox('Rotate-Button', { size: 0.50 }, scene)
    buttonMesh.material = createColorMaterial(Color3.FromInts(86, 176, 0))
    buttonMesh.position = new Vector3(-1, 0.25, -1)
    buttonMesh.startInteraction = (pointerInfo, controllerMesh, ctx) => {
        jumperMesh.spinning = true
        jumperMesh.interacted = true
        buttonMesh.scaling = new Vector3(0.9, 0.9, 0.9)
    }

    buttonMesh.endInteraction = () => {
        jumperMesh.spinning = false
        buttonMesh.scaling = Vector3.One()
    }
    buttonMesh.setParent(parentMesh)

    // Scoreboard
    // Current streak, current flips
    // Max streak, max flips

    return parentMesh
}
