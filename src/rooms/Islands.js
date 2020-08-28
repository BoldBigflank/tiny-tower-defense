const {
    Animation, Color3, Vector3, Mesh, Space, MeshBuilder
} = BABYLON

const DegreesToRadians = (degrees) => degrees / 57.2958

export async function setup(ctx) {
    const { scene, engine } = ctx
    const islandMesh = MeshBuilder.CreateBox('Island', {}, scene)

    for (let i = 0; i < 24; i++) {
        // Transform
        const islandMeshClone = islandMesh.clone(`Island-${i}`)
        const angle = Math.random() * 2 * Math.PI
        const distance = 750 * Math.sqrt(Math.random()) + 15

        islandMeshClone.scaling = new Vector3(30, 30, 30)
        islandMeshClone.position = new Vector3(distance * Math.cos(angle), 15, distance * Math.sin(angle))
        islandMeshClone.parent = ctx.ocean
        console.log('island position', islandMeshClone.position)
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
