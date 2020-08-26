import { intersectDrawings } from '../utils/meshGenerator'
import { wave } from '../content/models.js'

const {
    Animation, Color3, Vector3, Mesh
} = BABYLON

const startNewWave = function () {
    this.position = new Vector3(Math.random() * 50 - 25, 0, Math.random() * 50 - 25)
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
    const { scene } = ctx
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
        waveMeshClone.scaling = new Vector3(Math.random() * 1.5 + 0.75, Math.random() * 1 + 0.5, 1)
        waveMeshClone.position = new Vector3(Math.random() * 50 - 25, 0, Math.random() * 50 - 25)

        startNewWave.bind(waveMeshClone)()
    }
    waveMesh.dispose()
}
