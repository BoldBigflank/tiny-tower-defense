import { colorHeightNME } from '../shaders/colorHeightNME'
const {
    Animation, Color3, Vector3, Mesh, Space, MeshBuilder
} = BABYLON

const DegreesToRadians = (degrees) => degrees / 57.2958

export async function setup(ctx) {
    const { scene, engine, xrDefault } = ctx
    // const islandMesh = MeshBuilder.CreateCylinder('Island', {diameterTop: 0, diameterBottom: 1}, scene)
    const islandMesh = MeshBuilder.CreateGround('Island', { subdivisions: 64 }, scene)

    for (let i = 0; i < 24; i++) {
        // Transform
        const islandMeshClone = islandMesh.clone(`Island-${i}`)
        const angle = Math.random() * 2 * Math.PI
        const distance = 750 * Math.sqrt(Math.random()) + 15
        // var noiseTexture = new BABYLON.PerlinNoiseProceduralTexture("Noise-Texture", 256, scene)
        var noiseTexture = new BABYLON.NoiseProceduralTexture("Noise-Texture")
        noiseTexture.coordinatesIndex = Math.random() * 100
        noiseTexture.animationSpeedFactor = 0.0
        noiseTexture.octaves = 6
        noiseTexture.persistence = 0.8
        var colorHeightMat = colorHeightNME()
        const block = colorHeightMat.getBlockByPredicate((b) => b.name === "Texture")
        block.texture = noiseTexture
        
        islandMeshClone.scaling = new Vector3(120, 1, 120)
        islandMeshClone.position = new Vector3(distance * Math.cos(angle), -5, distance * Math.sin(angle))
        islandMeshClone.parent = ctx.ocean
        islandMeshClone.material = colorHeightMat
        islandMeshClone.checkCollisions = true
        if (xrDefault.teleportation) xrDefault.teleportation.addFloorMesh(islandMeshClone)

        // Move/rotate the islands to give the illusion of ship movement
        scene.registerAfterRender(() => {
            const dt = engine.getDeltaTime() / 1000
            // Position
            islandMeshClone.position.z += ctx.sailing.speed * dt
            // Turning rotation
            islandMeshClone.rotateAround(ctx.sailing.position, Vector3.Up(), DegreesToRadians(ctx.sailing.rotation) * dt)
        })
    }
    islandMesh.dispose()
}
