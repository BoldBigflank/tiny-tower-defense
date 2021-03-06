import { intersectDrawings, createColorMaterial } from '../utils/meshGenerator'
import { addGrabbable, addAnchorControl, addSpinnable } from '../utils/behaviors'
import { shipBack, shipDeck, shipFront, desk } from '../content/models.js'
import * as WavesStation from './Waves'
import * as IslandsStation from './Islands'

const {
    Color3, Vector3, HemisphericLight, PointLight, StandardMaterial, MeshBuilder, TransformNode, WebXRState
} = BABYLON

const DegreesToRadians = (degrees) => degrees / 57.2958

export async function setup(ctx) {
    // ctx is an object with the other rooms, assets,
    // I need access to textures
    // materials
    const { scene, engine, xrHelper, xrDefault } = ctx
    // Add lights to the scene
    const light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    // light1.diffuse = new Color3(1, 1, 0.85)
    light1.oceanColor = new Color3(0, 0, 0)
    const light2 = new PointLight('light2', new Vector3(0, 25, -1), scene)
    light2.intensity = 0.3

    // Ground
    const oceanColor = new Color3(0.004, 0.608, 0.991)
    const oceanMat = createColorMaterial(oceanColor)
    oceanMat.specularColor = oceanColor
    // oceanMat.emissiveColor = new Color3(0.004, 0.608, 0.991)

    const ocean = MeshBuilder.CreateGround('ocean', { width: 1000, height: 1000 }, scene)
    ctx.ocean = ocean
    ocean.material = oceanMat
    ocean.checkCollisions = true
    ocean.position.y = 0.1
    if (xrDefault.teleportation) xrDefault.teleportation.addFloorMesh(ocean)

    // // Desk
    // const mesh = intersectDrawings(desk)
    // mesh.name = 'Grabbable-Desk'
    // addGrabbable(mesh)
    // scene.addMaterial(mesh.material)
    // scene.addMesh(mesh)
    // mesh.position = new Vector3(0, 5, 0)

    const shipFloorColor = new Color3(0.54, 0.39, 0.33)
    const shipMat = createColorMaterial(shipFloorColor)

    const shipBackMesh = intersectDrawings(shipBack)
    shipBackMesh.position.z = 2
    shipBackMesh.checkCollisions = true
    const shipDeckMesh = intersectDrawings(shipDeck)
    shipDeckMesh.position.z = 1
    const shipDeckMesh2 = shipDeckMesh.clone()
    shipDeckMesh2.position.z = 0
    const shipFrontMesh = intersectDrawings(shipFront)
    shipFrontMesh.position.z = -1

    // Mast
    const shipMast = MeshBuilder.CreateCylinder('Mast1', {
        height: 33 / 5,
        diameter: 0.5 / 5
    })
    shipMast.position.z = 1
    shipMast.material = shipMat

    const shipMast2 = shipMast.clone('Mast2')
    shipMast2.position.z = -1

    // Controls
    const anchorBox = MeshBuilder.CreateBox('Anchor-Control', {size: 0.1}, scene)
    addAnchorControl(anchorBox)
    anchorBox.position = new Vector3(0.25, 0.6, 2)

    const helmBox = MeshBuilder.CreateBox('Helm-Control', { height: 0.2, width: 0.2, depth: 0.025 }, scene)
    addSpinnable(helmBox)

    // helmBox.position = new Vector3(0, -0.2, 1.8)
    helmBox.position = new Vector3(0, 0.7, 1.8)


    // Ship floors
    // const floor1 = MeshBuilder.CreateGround('Floor', {}, scene)
    const floor1 = MeshBuilder.CreateBox('Floor1', { height: 1 / 24 })
    floor1.checkCollisions = true
    floor1.material = shipMat
    floor1.scaling = new Vector3(0.99, 0.99, 4)
    floor1.position = new Vector3(0, -0.51, 0.5)
    floor1.overrideMaterialSideOrientation = BABYLON.Mesh.DOUBLESIDE
    if (xrDefault.teleportation) xrDefault.teleportation.addFloorMesh(floor1)

    const floor2 = floor1.clone('Floor2')
    floor2.position.y += 0.5
    if (xrDefault.teleportation) xrDefault.teleportation.addFloorMesh(floor2)

    const floor3 = floor2.clone('Floor3')
    floor3.position = new Vector3(0, 0.5, 2)
    floor3.scaling = new Vector3 (0.99, 0.99, 0.99)
    if (xrDefault.teleportation) xrDefault.teleportation.addFloorMesh(floor3)


    const shipMesh = new TransformNode('Ship', scene)
    shipBackMesh.parent = shipMesh
    shipDeckMesh.parent = shipMesh
    shipDeckMesh2.parent = shipMesh
    shipFrontMesh.parent = shipMesh
    anchorBox.parent = shipMesh
    helmBox.parent = shipMesh
    shipMast.parent = shipMesh
    shipMast2.parent = shipMesh
    floor1.parent = shipMesh
    floor2.parent = shipMesh
    floor3.parent = shipMesh

    shipMesh.position.y = 2.5
    // This makes it 5 units high, or 2.5 units per floor.
    shipMesh.scaling = new Vector3(5, 5, 5)
    // cabinFloorMesh.parent = shipMesh

    // Make waves
    ctx.sailing = {
        speed: 7,
        rotation: 0, // The rotation value of the ship's helm
        position: shipMesh.position
    }
    await WavesStation.setup(ctx)
    await IslandsStation.setup(ctx)
    // Only move when you're at the helm
    scene.registerAfterRender(() => {
        if (scene.activeCamera.position.y < 4) {
            ctx.sailing.speed = 0
            ctx.sailing.rotation = 0
        }
    })
}

export function enter(ctx) {

}

export function exit(ctx) {
    // Remove scene stuff
}

export function execute(ctx, delta, time) {
    // Used to advance animations on Materials and meshes
}
