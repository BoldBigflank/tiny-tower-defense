import './style.scss'
import { mapScene } from './utils/mapGenerator'

const init = async () => {
    const canvas = document.getElementById('renderCanvas')
    const engine = new BABYLON.Engine(canvas, true)
    // createScene function that creates and return the scene
    
    // call the createScene function
    const scene = await mapScene(engine, canvas)
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
