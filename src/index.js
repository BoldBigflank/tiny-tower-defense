import './style.scss'
import { mapScene } from './utils/mapGenerator'
import * as roomShip from './rooms/Ship.js'

const {
    Scene, Color3, Vector3, UniversalCamera, HemisphericLight, PointLight, StandardMaterial, MeshBuilder, PointerEventTypes
} = BABYLON

const context = {}

const init = async () => {
    const canvas = document.getElementById('renderCanvas')
    const engine = new BABYLON.Engine(canvas, true)
    // createScene function that creates and return the scene

    // call the createScene function
    engine.displayLoadingUI()
    // const scene = await mapScene(engine, canvas)
    // Create the scene space
    const scene = new Scene(engine)
    scene.ambientColor = new Color3(0.96, 0.84, 0.1)
    scene.gravity = new Vector3(0, -9.81, 0)
    scene.collisionsEnabled = true
    context.scene = scene

    // Add a camera to the scene and attach it to the canvas
    const camera = new UniversalCamera('Camera', new Vector3(0, 2, -5), scene)
    camera.attachControl(canvas, true)
    camera.speed = 0.1
    camera.angularSensibility = 9000
    camera.applyGravity = true
    camera.ellipsoid = new Vector3(1, 1, 1)
    camera.checkCollisions = true

    // XR start
    const xrHelper = await scene.createDefaultXRExperienceAsync() // WebXRDefaultExperience
    context.xrHelper = xrHelper

    // Interactions
    scene.onPointerObservable.add((pointerInfo) => {
        const pickedMesh = pointerInfo.pickInfo.pickedMesh
        if (!pickedMesh) return
        const xrInput = xrHelper.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId)
        if (!xrInput) return
        const motionController = xrInput.motionController
        if (!motionController) return

        switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
            console.log('POINTER DOWN', pointerInfo)
            if (pickedMesh.startInteraction) {
                pickedMesh.startInteraction(motionController.rootMesh)
            }
            break
        case PointerEventTypes.POINTERUP:
            console.log('POINTER UP')
            if (pickedMesh.endInteraction) {
                pickedMesh.endInteraction(motionController.rootMesh)
            }
            break
        // case PointerEventTypes.POINTERMOVE:
        //     console.log('POINTER MOVE')
        //     break
        // case PointerEventTypes.POINTERWHEEL:
        //     console.log('POINTER WHEEL')
        //     break
        // case PointerEventTypes.POINTERPICK:
        //     console.log('POINTER PICK')
        //     break
        // case PointerEventTypes.POINTERTAP:
        //     console.log('POINTER TAP')
        //     break
        // case PointerEventTypes.POINTERDOUBLETAP:
        //     console.log('POINTER DOUBLE-TAP')
        //     break
        default: break
        }
    })

    // Load the Ship
    await roomShip.setup(context)

    engine.hideLoadingUI()

    scene.debugLayer.show()

    // run the render loop
    engine.runRenderLoop(() => {
        scene.render()
    })

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
        engine.resize()
    })
}
window.addEventListener('DOMContentLoaded', init)
