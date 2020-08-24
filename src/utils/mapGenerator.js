import { desk } from '../content/models'
import { intersectDrawings } from './meshGenerator'

const {
    Scene, Color3, Vector3, UniversalCamera, HemisphericLight, PointLight, StandardMaterial, MeshBuilder, PointerEventTypes
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

    // Ground
    const groundMat = new StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new Color3(0.5, 0, 0)
    groundMat.specularColor = new Color3(0, 0, 0)

    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene)
    ground.material = groundMat
    ground.checkCollisions = true

    //
    const shapeMat = new StandardMaterial('Material-Shape', scene)
    shapeMat.diffuseColor = new Color3(0.8, 0.4, 0.3)

    const mesh = intersectDrawings(desk, shapeMat)
    mesh.name = 'Grabbable-Desk'

    const mesh2 = mesh.clone('Grabbable-Desk2')
    mesh2.position.x = -3

    var pointerDragBehavior = new BABYLON.PointerDragBehavior();
    pointerDragBehavior.moveAttached = false
    // Listen to drag events
    pointerDragBehavior.onDragStartObservable.add((event) => {
        console.log("dragStart");
        console.log(event);
        let xrInput = xrHelper.pointerSelection.getXRControllerByPointerId(event.pointerId)
        if (!xrInput) return
        let motionController = xrInput.motionController
        if (motionController) {
            // TODO: Fire startInteraction()
            pointerDragBehavior.attachedNode.setParent(motionController.rootMesh)
        }
    })
    pointerDragBehavior.onDragObservable.add((event) => {
        console.log("drag");
        console.log(event);
    })
    pointerDragBehavior.onDragEndObservable.add((event) => {
        console.log("dragEnd");
        console.log(event);
        pointerDragBehavior.attachedNode.setParent(null)
    })

    // If handling drag events manually is desired, set move attached to false
    // pointerDragBehavior.moveAttached = false;
    mesh.addBehavior(pointerDragBehavior)
    mesh2.addBehavior(pointerDragBehavior)

    // https://doc.babylonjs.com/how_to/meshbehavior
    scene.addMesh(mesh)
    mesh.position = new Vector3(0, 0.5, 0)

    // XR start
    const xrHelper = await scene.createDefaultXRExperienceAsync() // WebXRDefaultExperience
    const teleportation = xrHelper.teleportation
    teleportation.addFloorMesh(ground)

    // Disable pointers
    // xrHelper.pointerSelection (WebXRControllerPointerSelection)

    // WebXRControllerPointerSelection.getXRControllerByPointerId
    // 

    // xrHelper.pointerSelection.detach()
    // xrHelper.pointerSelection.disableAutoAttach()
    // xrHelper.pointerSelection.xrNativeFeatureName = 'hand-tracking'


    // TODO: Watch all controllers, activate pointer if the trigger is pulled on one

    //Input
    const xrInput = xrHelper.input // WebXRInput
    // xrInput.controllers
    // xrInput.onControllerAddedObservable/onControllerRemovedObservable
    
    // xrInput.xrCamera
    // xrSessionManager
    xrInput.onControllerAddedObservable.add((motionController) => {
        // motionController (WebXRInputSource)
        // motionController.pointer (mesh)
        // motionController.uniqueId

        console.log('motionController added', motionController)
        motionController.onMeshLoadedObservable.add((controllerMesh) => {
            // We have the new mesh
            // Create an interaction collider
            // var sphere = MeshBuilder.CreateSphere("sphere", { diameter: 0.12, segments: 32 }, scene)
            // sphere.setParent(controllerMesh)
            // sphere.position = new Vector3(0, -.075, -0.1)

            // Add things like wrist pockets
        })
        // motionController.pointer.id: "controller-3-tracked-pointer-left-pointer"
    })

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
            console.log('POINTER DOWN', pointerInfo)
            // if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh) {
            //     // "Grab" it by attaching the picked mesh to the VR Controller
            //     let xrInput = xrHelper.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId)
            //     if (!xrInput) return
            //     let motionController = xrInput.motionController
            //     if (motionController) {
            //         // TODO: Fire startInteraction()
            //         pointerInfo.pickInfo.pickedMesh.setParent(motionController.rootMesh)
            //     }
            // }
            break
        case PointerEventTypes.POINTERUP:
            console.log('POINTER UP')
            // TODO: Fire endInteraction() 
            break
        // case PointerEventTypes.POINTERMOVE:
        //     console.log('POINTER MOVE')
        //     break
        case PointerEventTypes.POINTERWHEEL:
            console.log('POINTER WHEEL')
            break
        case PointerEventTypes.POINTERPICK:
            console.log('POINTER PICK')
            break
        case PointerEventTypes.POINTERTAP:
            console.log('POINTER TAP')
            break
        case PointerEventTypes.POINTERDOUBLETAP:
            console.log('POINTER DOUBLE-TAP')
            break
        default: break
        }
    })

    return scene
}

const createShip = async () => {

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
