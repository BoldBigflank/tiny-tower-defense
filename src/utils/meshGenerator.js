// import { Vector3, CSG, Mesh, MeshBuilder } from 'babylonjs'

const {
    Vector3, Color3, MeshBuilder, Mesh, CSG, StandardMaterial, SolidParticleSystem, DynamicTexture
} = BABYLON

const GRID_TO_UNITS = 1 / 3

const scaledVector3 = (x, y, z, scale) => {
    scale = scale || GRID_TO_UNITS
    return new Vector3(x * scale, y * scale, z * scale)
}

const createColorMaterial = (color) => {
    // Desk
    const colorMat = new StandardMaterial('Material-Shape')
    colorMat.diffuseColor = color
    return colorMat
}

// Input an array of polygons, an axis
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

    polygons.forEach((polygon) => {
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

// Input an array of drawings, a material
// Return a Mesh made by intersecting the meshes made by extruding each drawing
const intersectDrawings = (modelObject) => {
    const { drawings, color } = modelObject
    const [r, g, b] = color.split(',')
    const colorMat = createColorMaterial(new Color3(r, g, b))
    const axes = ['x', 'y', 'z']
    const extrudeMeshes = []
    // Make a mesh from each of the shapes
    drawings.forEach((drawing, i) => {
        if (!drawing.polygons.length) return null // Don't extrude meshes
        if (drawing.mirror) {
            const mirrorPolygons = []
            drawing.polygons.forEach((polygon) => {
                const mirrorPolygon = []
                for (let i = polygon.length - 1; i >= 0; i--) {
                    const [x, y] = polygon[i]
                    mirrorPolygon.push([64 - x, y])
                }
                mirrorPolygons.push(mirrorPolygon)
            })
            drawing.polygons.push(...mirrorPolygons)
        }
        const extrudeMesh = extrudePolygons(drawing.polygons)
        // Rotate based on the axis we're making
        if (axes[i] === 'x') extrudeMesh.rotate(Vector3.Up(), -Math.PI / 2)
        if (axes[i] === 'y') extrudeMesh.rotate(Vector3.Right(), Math.PI / 2)

        extrudeMeshes.push(extrudeMesh)
    })
    if (!extrudeMeshes.length) return null
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

    const resultMesh = resultCSG.toMesh('Result-Mesh', colorMat, null, true)

    extrudeMeshes.forEach((mesh) => mesh.dispose())
    return resultMesh
}

const blockMesh = (modelObject, scene) => {
    // Convert the object points to binary
    const { size, blocks, pickable } = modelObject
    const [WIDTH, HEIGHT, DEPTH] = size
    const [sideString, topString, frontString] = blocks
    const side = sideString.padStart(DEPTH * HEIGHT, '0').split('')
    const top = topString.padStart(WIDTH * DEPTH, '0').split('')
    const front = frontString.padStart(WIDTH * HEIGHT, '0').split('')
    const BOX_SIZE = 1 / WIDTH
    // Make a SPS
    // First create the SPS
    const SPS = new SolidParticleSystem('SPS', scene, { isPickable: pickable })
    const box = MeshBuilder.CreateBox('b', { size: BOX_SIZE })
    SPS.addShape(box, WIDTH * HEIGHT * DEPTH)
    box.dispose()
    const sculptureMesh = SPS.buildMesh() // finally builds and displays the real mesh
    sculptureMesh.metadata = { sps: SPS }
    sculptureMesh.position.y = 1

    SPS.initParticles = function() {
        for (let i = 0; i < SPS.nbParticles; i++) {
            const particle = SPS.particles[i]
            particle.props = { on: true }
            // Set the initial position
            const tileX = (i % WIDTH)
            const tileY = Math.floor(i / HEIGHT) % DEPTH
            const tileZ = Math.floor(Math.floor(i / WIDTH) / HEIGHT)
            particle.position = new Vector3(
                BOX_SIZE * (tileX + 0.5) - 0.5,
                BOX_SIZE * (tileY + 0.5) - 0.5,
                BOX_SIZE * (tileZ + 0.5) - 0.5
            )
            // Scale based on the modelObject
            const sideBool = parseInt(side[tileY * DEPTH + tileZ]) === 1
            const topBool = parseInt(top[tileZ * WIDTH + tileX]) === 1
            const frontBool = parseInt(front[tileY * WIDTH + tileX]) === 1
            particle.scaling = (sideBool && topBool && frontBool) ? Vector3.One() : Vector3.Zero()
            // addErasable(particle)
        }
    }
    // addSPSEvents(sculptureMesh)

    SPS.initParticles()
    SPS.setParticles()
    SPS.refreshVisibleSize() // force the BBox recomputation
    return sculptureMesh
}

const textPanelMesh = (text, scene) => {
    const panelWidth = 512
    const panelHeight = 341
    const mesh = MeshBuilder.CreatePlane('TextMesh', { width: 1, height: 2 / 3 }, scene)

    const borderRadius = 64
    const texture = new DynamicTexture('TextTexture', { width: panelWidth, height: panelHeight }, scene)
    const material = new StandardMaterial('TextMaterial', scene)
    material.diffuseTexture = texture
    material.diffuseTexture.hasAlpha = true
    mesh.material = material
    mesh.updateText = function(text) {
        const texture = this.material.diffuseTexture
        const context = texture.getContext()
        context.fillStyle = 'transparent'
        context.fillRect(0, 0, panelWidth, panelHeight)
    
        // Rounded background
        context.beginPath()
        context.moveTo(panelWidth, panelHeight)
        context.arcTo(0, panelHeight, 0, 0, borderRadius) // bottom left
        context.arcTo(0, 0, panelWidth, 0, borderRadius) // top left
        context.arcTo(panelWidth, 0, panelWidth, panelHeight, borderRadius) // top right
        context.arcTo(panelWidth, panelHeight, 0, panelHeight, borderRadius) // bottom right
        context.fillStyle = 'black'
        context.fill()
    
        // Text
        context.font = '64px Helvetica'
        context.fillStyle = 'white'
        context.fillText(text, 100, 100)
        texture.update()
        mesh.billboardMode = Mesh.BILLBOARDMODE_Y
    }
    mesh.rotate(Vector3.Right(), Math.PI / 8)
    mesh.updateText(text)
    return mesh
}

export {
    intersectDrawings, createColorMaterial, blockMesh, textPanelMesh
}
