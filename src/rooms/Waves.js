import { intersectDrawings } from '../utils/meshGenerator'
import { wave } from '../content/models.js'

const {
    Animation, Color3, Vector3, Mesh, Space
} = BABYLON

const DegreesToRadians = (degrees) => degrees / 57.2958

const startNewWave = function () {
    const r = 50 * Math.random() + 10
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
    const waveMesh = intersectDrawings(wave)
    waveMesh.setPivotPoint(new Vector3(0.5, 0, 0.5))
    waveMesh.billboardMode = Mesh.BILLBOARDMODE_Y
    waveMesh.material.emissiveColor = Color3.White()

    const keys = [
        { frame: 0, value: 0.0 },
        { frame: 13, value: 0.8},
        { frame: 24, value: 1.0 },
        { frame: 35, value: 0.8 },
        { frame: 50, value: 0.0 }
    ]
    // Animation
    const wavesAnimation = new Animation(
        'wavesAnimation',
        'scaling.z',
        30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
    )
    wavesAnimation.setKeys(keys)
    waveMesh.animations = []
    waveMesh.animations.push(wavesAnimation)
    scene.addMesh(waveMesh)

    for (let i = 0; i < 24; i++) {
        // Transform
        const waveMeshClone = waveMesh.clone(`WaveMesh-${i}`)
        waveMeshClone.parent = ctx.ocean

        startNewWave.bind(waveMeshClone)()
        // Move/rotate the wave to give the illusion of movement
        scene.registerAfterRender(() => {
            const dt = engine.getDeltaTime() / 1000
            // New Position
            waveMeshClone.position.z += ctx.sailing.speed * dt
            // Turning rotation
            waveMeshClone.rotateAround(ctx.sailing.position, Vector3.Up(), DegreesToRadians(ctx.sailing.rotation) * dt)
        })
    }
    waveMesh.dispose()
}
