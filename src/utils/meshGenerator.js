// import { Vector3, CSG, Mesh, MeshBuilder } from 'babylonjs'

const { Vector3, MeshBuilder, Mesh, CSG } = BABYLON

const GRID_TO_UNITS = 1 / 3

const scaledVector3 = (x, y, z, scale) => {
    scale = scale || GRID_TO_UNITS
    return new Vector3(x * scale, y * scale, z * scale)
}


// Input an array of polygons, an axis and a scene
// Return a Mesh made by extruding each polygon along that axis
const extrudePolygons = (polygons) => {
    const meshes = []
    // Assume a max grid size of 64x64

    // Make a path from 0.5 to -0.5 on the given axis
    // Reversed on x and y so we draw top down view
    // and right side view
    const path = [
        scaledVector3(0, 0, -1, 1 / 2),
        scaledVector3(0, 0, 1, 1 / 2)
    ]

    polygons.forEach((polygon, i) => {
        const shape = polygon.map((point) => {
            const [x, y] = point
            const z = 0
            return scaledVector3(x - 32, y - 32, z, 1 / 64) // Normalize the polygon
        })
        shape.push(shape[0])

        const extrusion = MeshBuilder.ExtrudeShape('star', {
            shape,
            path,
            cap: Mesh.CAP_ALL,
            updatable: true
        })
        meshes.push(extrusion)
    })
    // Merge the meshes
    const newMesh = Mesh.MergeMeshes(meshes, true)
    return newMesh
}

// Input an array of drawings, a material and a scene
// Return a Mesh made by intersecting the meshes made by extruding each drawing
const intersectDrawings = (drawings, shapeMat) => {
    const axes = ['x', 'y', 'z']
    const extrudeMeshes = []
    // Make a mesh from each of the shapes
    drawings.forEach((drawing, i) => {
        const extrudeMesh = extrudePolygons(drawing.polygons)
        // Rotate based on the axis we're making
        if (axes[i] === 'x') extrudeMesh.rotate(Vector3.Up(), -Math.PI / 2)
        if (axes[i] === 'y') extrudeMesh.rotate(Vector3.Right(), Math.PI / 2)

        extrudeMeshes.push(extrudeMesh)
    })
    // Make CSG from each
    // Combine using intersect
    let resultCSG = null
    extrudeMeshes.forEach((extrudeMesh) => {
        const shapeCSG = CSG.FromMesh(extrudeMesh)
        if (!resultCSG) resultCSG = shapeCSG
        else {
            resultCSG.intersectInPlace(shapeCSG)
        }
    })

    const resultMesh = resultCSG.toMesh('Result-Mesh', shapeMat, null, true)
    extrudeMeshes.forEach((mesh) => mesh.dispose())
    return resultMesh
}

export { intersectDrawings }
