import './style.scss'

const init = async () => {
    const canvas = document.getElementById('renderCanvas')
    const engine = new BABYLON.Engine(canvas, true)
    // createScene function that creates and return the scene
    const createScene = async () => {
        // create a basic BJS Scene object
        const scene = new BABYLON.Scene(engine)

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero())

        // attach the camera to the canvas
        camera.attachControl(canvas, false)

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)

        // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
        const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene)

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1

        // create a built-in "ground" shape;
        const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene)

        var xr = await scene.createDefaultXRExperienceAsync();

        // return the created scene
        return scene
    }

    // call the createScene function
    const scene = await createScene()

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
