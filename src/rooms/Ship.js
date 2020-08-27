import { intersectDrawings, createColorMaterial } from '../utils/meshGenerator'
import { addGrabbable } from '../utils/behaviors'
import { shipBack, shipDeck, shipFront, desk } from '../content/models.js'
import * as WavesStation from './Waves'

const {
    Color3, Vector3, HemisphericLight, PointLight, StandardMaterial, MeshBuilder, TransformNode
} = BABYLON

export async function setup(ctx) {
    // ctx is an object with the other rooms, assets,
    // I need access to textures
    // materials
    const { scene, xrHelper } = ctx
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

    const ocean = MeshBuilder.CreateGround('ocean', { width: 100, height: 100 }, scene)
    ocean.material = oceanMat
    ocean.checkCollisions = true
    ocean.position.y = -0.1
    if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(ocean)

    // Desk
    const mesh = intersectDrawings(desk)
    mesh.name = 'Grabbable-Desk'
    addGrabbable(mesh)
    scene.addMaterial(mesh.material)
    scene.addMesh(mesh)
    mesh.position = new Vector3(0, 5, 0)

    // const cabinWallsMesh = intersectDrawings(cabinWalls)
    // scene.addMesh(cabinWallsMesh)
    // cabinWallsMesh.setPivotPoint(new Vector3(0, -.5, 0))
    // cabinWallsMesh.position = new Vector3(0, 5, 0)
    // cabinWallsMesh.scaling = new Vector3(10, 10, 10)
    // cabinWallsMesh.checkCollisions = true

    // // Cabin Floor
    // const cabinFloorMesh = intersectDrawings(cabinFloor)
    // scene.addMesh(cabinFloorMesh)
    // cabinFloorMesh.setPivotPoint(new Vector3(0, -.5, 0))
    // cabinFloorMesh.position = new Vector3(0, 4.9, -5)
    // cabinFloorMesh.scaling = new Vector3(10, 10, .2)
    // cabinFloorMesh.checkCollisions = true
    // if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(cabinFloorMesh)

    // // Cabin Roof/Quarterdeck floor
    // const quarterdeckFloorMesh = cabinFloorMesh.clone('Quarterdeck-Floor')
    // quarterdeckFloorMesh.position.y += 2.5
    // if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(quarterdeckFloorMesh)


    const shipBackMesh = intersectDrawings(shipBack)
    shipBackMesh.position.z = 2
    const shipDeckMesh = intersectDrawings(shipDeck)
    shipDeckMesh.position.z = 1
    const shipDeckMesh2 = shipDeckMesh.clone()
    shipDeckMesh2.position.z = 0
    const shipFrontMesh = intersectDrawings(shipFront)
    shipFrontMesh.position.z = -1

    // Ship floors
    const shipFloorColor = new Color3(0.54, 0.39, 0.33)
    const shipFloorMat = createColorMaterial(shipFloorColor)
    // const floor1 = MeshBuilder.CreateGround('Floor', {}, scene)
    const floor1 = MeshBuilder.CreateBox('Floor1', { height: 1 / 24 })
    floor1.checkCollisions = true
    floor1.material = shipFloorMat
    floor1.scaling = new Vector3(0.99, 0.99, 4)
    floor1.position = new Vector3(0, -0.51, 0.5)
    floor1.overrideMaterialSideOrientation = BABYLON.Mesh.DOUBLESIDE
    if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(floor1)

    const floor2 = floor1.clone('Floor2')
    floor2.position.y += 0.5
    if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(floor2)

    const floor3 = floor2.clone('Floor3')
    floor3.position = new Vector3(0, 0.5, 2)
    floor3.scaling = new Vector3 (0.99, 0.99, 0.99)
    if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(floor3)


    const shipMesh = new TransformNode('Ship')
    shipBackMesh.parent = shipMesh
    shipDeckMesh.parent = shipMesh
    shipDeckMesh2.parent = shipMesh
    shipFrontMesh.parent = shipMesh
    floor1.parent = shipMesh
    floor2.parent = shipMesh
    floor3.parent = shipMesh

    shipMesh.position.y = 2.5
    shipMesh.scaling = new Vector3(5, 5, 5)
    // cabinFloorMesh.parent = shipMesh
    
    // Make waves
    await WavesStation.setup(ctx)
}

export function enter(ctx) {

}

export function exit(ctx) {
    // Remove scene stuff
}

export function execute(ctx, delta, time) {
    // Used to advance animations on Materials and meshes
}
