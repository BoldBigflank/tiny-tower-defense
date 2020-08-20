import { desk } from '../content/models'
import { intersectDrawings } from './meshGenerator'

const {
    Scene, Color3, Vector3, UniversalCamera, HemisphericLight, PointLight, StandardMaterial, MeshBuilder
} = BABYLON
// Generate a map scene
// This is the hard coded way to make a map
const mapScene = async (engine, canvas) => {
    // Create the scene space
    const scene = new Scene(engine)
    scene.ambientColor = new Color3(0.96, 0.84, 0.1)
    scene.gravity = new Vector3(0, -9.81, 0)
    scene.collisionsEnabled = true

    // Add a camera to the scene and attach it to the canvas
    const camera = new UniversalCamera('Camera', new Vector3(0, 2, -5), scene)
    camera.attachControl(canvas, true)
    camera.speed = 0.1
    camera.angularSensibility = 9000
    camera.applyGravity = true
    camera.ellipsoid = new Vector3(1, 1, 1)
    camera.checkCollisions = true
    // Add lights to the scene
    new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    new PointLight('light2', new Vector3(0, 5, -1), scene)

    // Add and manipulate meshes in the scene
    // MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)

    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.5, 0, 0)
    groundMat.specularColor = new Color3(0, 0, 0)

    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene)
    ground.material = groundMat
    ground.checkCollisions = true

    const shapeMat = new StandardMaterial('Material-Shape', scene)
    shapeMat.diffuseColor = new Color3(0.8, 0.4, 0.3)

    const mesh = intersectDrawings(desk, shapeMat, scene)
    mesh.scaling = new Vector3(3, 3, 3)
    mesh.position = new Vector3(0, 1.5, 0)

    // XR start
    const xr = await scene.createDefaultXRExperienceAsync()
    return scene
}

const createShip = async ( ) => {

}

// This takes an array of data objects, each of which describe:
// Model id, transform, options such as grabbable
const generateMap = async (engine, canvas, mapObject) => {
    // mapObject.forEach((object) => {
    //     switch (object.type) {
    //         case MODEL_TYPES.GENERATOR:
    //             // Create the mesh from the model object
    //             break
    //     }
    // })
}

export { mapScene, generateMap }
