import { intersectDrawings, createColorMaterial } from '../utils/meshGenerator'
import { addGrabbable } from '../utils/behaviors'
import { cabinWalls, cabinFloor, desk } from '../content/models.js'
import * as WavesStation from './Waves'

const {
    Color3, Vector3, HemisphericLight, PointLight, StandardMaterial, MeshBuilder
} = BABYLON

export async function setup(ctx) {
    // ctx is an object with the other rooms, assets,
    // I need access to textures
    // materials
    const { scene, xrHelper } = ctx
    // Add lights to the scene
    const light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    // light1.diffuse = new Color3(1, 1, 0.85)
    light1.groundColor = new Color3(0, 0, 0)
    const light2 = new PointLight('light2', new Vector3(0, 25, -1), scene)
    light2.intensity = 0.3

    // Ground
    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.004, 0.608, 0.991)
    // groundMat.ambientColor = new Color3(0.004, 0.608, 0.991)
    groundMat.specularColor = new Color3(0.004, 0.608, 0.991)
    // groundMat.emissiveColor = new Color3(0.004, 0.608, 0.991)

    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene)
    ground.material = groundMat
    ground.checkCollisions = true
    ground.position.y = -0.1
    // if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(ground)

    // Desk
    const mesh = intersectDrawings(desk)
    mesh.name = 'Grabbable-Desk'
    addGrabbable(mesh)
    scene.addMaterial(mesh.material)
    scene.addMesh(mesh)
    mesh.position = new Vector3(0, 5, 0)

    const cabinWallsMesh = intersectDrawings(cabinWalls)
    scene.addMesh(cabinWallsMesh)
    cabinWallsMesh.setPivotPoint(new Vector3(0, -.5, 0))
    cabinWallsMesh.position = new Vector3(0, 5, 0)
    cabinWallsMesh.scaling = new Vector3(10, 10, 10)
    cabinWallsMesh.checkCollisions = true


    // Cabin Floor
    const cabinFloorMesh = intersectDrawings(cabinFloor)
    scene.addMesh(cabinFloorMesh)
    cabinFloorMesh.setPivotPoint(new Vector3(0, -.5, 0))
    cabinFloorMesh.position = new Vector3(0, 4.9, -5)
    cabinFloorMesh.scaling = new Vector3(10, 10, .2)
    cabinFloorMesh.checkCollisions = true
    if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(cabinFloorMesh)

    // Cabin Roof/Quarterdeck floor
    const quarterdeckFloorMesh = cabinFloorMesh.clone('Quarterdeck-Floor')
    quarterdeckFloorMesh.position.y += 2.5
    if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(quarterdeckFloorMesh)

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
