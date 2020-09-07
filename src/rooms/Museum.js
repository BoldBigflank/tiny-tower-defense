import { createColorMaterial } from '../utils/meshGenerator'
import { catBlock } from '../content/models.js'
import * as SculpturesStation from './Sculptures'

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
    light1.groundColor = new Color3(0, 0, 0)
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
    if (xrDefault.teleportation) {
        xrDefault.teleportation.addFloorMesh(ocean)
        xrDefault.teleportation.snapPointsOnly = true
    }

    // The cat block puzzle
    SculpturesStation.setup(catBlock, ctx)
}

export function enter(ctx) {

}

export function exit(ctx) {
    // Remove scene stuff
}

export function execute(ctx, delta, time) {
    // Used to advance animations on Materials and meshes
}
