import { intersectDrawings } from '../utils/meshGenerator'
import { addGrabbable } from '../utils/behaviors'
import { desk } from '../content/models.js'

const {
    Color3, Vector3, HemisphericLight, PointLight, StandardMaterial, MeshBuilder
} = BABYLON

export async function setup(ctx) {
    // ctx is an object with the other rooms, assets,
    // I need access to textures
    // materials
    const { scene, xrHelper } = ctx
    // Add lights to the scene
    new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    new PointLight('light2', new Vector3(0, 5, -1), scene)

    // Ground
    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.5, 0, 0)
    groundMat.specularColor = new Color3(0, 0, 0)

    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene)
    ground.material = groundMat
    ground.checkCollisions = true
    xrHelper.teleportation.addFloorMesh(ground)

    // Desk
    const shapeMat = new StandardMaterial('Material-Shape', scene)
    shapeMat.diffuseColor = new Color3(0.8, 0.4, 0.3)

    const mesh = intersectDrawings(desk, shapeMat)
    mesh.name = 'Grabbable-Desk'
    addGrabbable(mesh)
    scene.addMesh(mesh)
    mesh.position = new Vector3(0, 0.5, 0)

    // Desk 2
    const mesh2 = mesh.clone('Grabbable-Desk2')
    mesh2.position.x = -3
    addGrabbable(mesh2)
}

export function enter(ctx) {

}

export function exit(ctx) {
    // Remove scene stuff
}

export function execute(ctx, delta, time) {
    // Used to advance animations on Materials and meshes
}
