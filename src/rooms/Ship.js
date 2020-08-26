import { intersectDrawings } from '../utils/meshGenerator'
import { addGrabbable } from '../utils/behaviors'
import { desk } from '../content/models.js'
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
    if (xrHelper.teleportation) xrHelper.teleportation.addFloorMesh(ground)

    // Desk
    const shapeMat = new StandardMaterial('Material-Shape', scene)
    shapeMat.diffuseColor = new Color3(0.8, 0.4, 0.3)

    const mesh = intersectDrawings(desk)
    mesh.name = 'Grabbable-Desk'
    addGrabbable(mesh)
    scene.addMaterial(mesh.material)
    scene.addMesh(mesh)
    mesh.position = new Vector3(0, 0.5, 0)

    // Desk 2
    const mesh2 = mesh.clone('Grabbable-Desk2')
    mesh2.position.x = -3
    addGrabbable(mesh2)

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
