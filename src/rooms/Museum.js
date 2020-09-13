import {
    blockMesh, createColorMaterial, hollowDrawings, textPanelMesh
} from '../utils/meshGenerator'
import {
    catBlock, shipBlock, squiggleBlock, skullBlock, linksBlock
} from '../content/models'
import * as Canon from '../content/canon.js'
import * as SculpturesStation from './Sculptures'
import * as WavesStation from './Waves'
import * as TrampStation from './Tramp'

const {
    Color3, CSG, Vector3, HemisphericLight, PointLight, StandardMaterial, Mesh, MeshBuilder, TransformNode, WebXRState
} = BABYLON

export async function setup(ctx) {
    // ctx is an object with the other rooms, assets,
    // I need access to textures
    // materials
    const {
        scene, engine, xrHelper, xrDefault
    } = ctx
    // Add lights to the scene
    const light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    // light1.diffuse = new Color3(1, 1, 0.85)
    light1.groundColor = new Color3(0, 0, 0)
    const light2 = new PointLight('light2', new Vector3(0, 25, -1), scene)
    light2.intensity = 0.3

    // TODO: Split the building and the floor for teleportation reasons
    // The buildings
    const outerBox = MeshBuilder.CreateBox('Sphere', { width: 15, height: 6.4, depth: 15 }, scene)
    outerBox.position.y = 3
    const buildingCSG = CSG.FromMesh(outerBox)
    const doorStamp = MeshBuilder.CreateBox('Sphere', { width: 4, height: 3, depth: 1 }, scene)
    doorStamp.position = new Vector3(0, 1.5, 7.5)
    const innerBox = MeshBuilder.CreateBox('Inner-Box', { width: 14.8, height: 6, depth: 14.8 }, scene)
    innerBox.position = new Vector3(0.05, 3, 0.05)
    // Hollow it out
    buildingCSG.subtractInPlace(CSG.FromMesh(innerBox))
    buildingCSG.subtractInPlace(CSG.FromMesh(doorStamp))

    // The floor
    const floorCircle = MeshBuilder.CreateCylinder('Cylinder', { height: 0.2, diameter: 30 })
    floorCircle.position = new Vector3(0, -0.1, 0)
    floorCircle.material = createColorMaterial(Color3.FromInts(86, 176, 0))
    const floorCSG = CSG.FromMesh(floorCircle)

    // One more to the side
    const floorCircle2 = floorCircle.clone('Floor-2')
    floorCircle2.position = new Vector3(0, -0.1, 20)
    floorCSG.unionInPlace(CSG.FromMesh(floorCircle2))
    floorCircle2.position = new Vector3(20, -0.1, 4)
    floorCSG.unionInPlace(CSG.FromMesh(floorCircle2))

    buildingCSG.subtractInPlace(floorCSG)

    const buildingMesh = buildingCSG.toMesh('Solid')
    buildingMesh.checkCollisions = true
    const floorMesh = floorCSG.toMesh('Floor', floorCircle.material, scene)
    floorMesh.checkCollisions = true

    scene.addMesh(buildingMesh)
    outerBox.dispose()
    doorStamp.dispose()
    innerBox.dispose()
    floorCircle.dispose()
    floorCircle2.dispose()

    // The floors

    const oceanColor = new Color3(0.004, 0.608, 0.991)
    const oceanMat = createColorMaterial(oceanColor)
    oceanMat.specularColor = oceanColor

    const ocean = MeshBuilder.CreateGround('ocean', { width: 1000, height: 1000 }, scene)
    ocean.position.y = -1
    ctx.ocean = ocean
    ocean.material = oceanMat
    if (xrDefault.teleportation) {
        // xrDefault.teleportation.addFloorMesh(ocean)
        xrDefault.teleportation.addFloorMesh(floorMesh)
        xrDefault.teleportation.addFloorMesh(buildingMesh)
    }

    // The cat block puzzle
    const catSculpture = await SculpturesStation.setup(catBlock, ctx)
    catSculpture.position = new Vector3(-3, 0, 5)

    const shipSculpture = await SculpturesStation.setup(shipBlock, ctx)
    shipSculpture.position = new Vector3(6, 0, 20)
    shipSculpture.rotate(Vector3.Up(), Math.PI / 2)

    const squiggleSculpture = await SculpturesStation.setup(squiggleBlock, ctx)
    squiggleSculpture.position = new Vector3(3, 0, 5)

    const skullSculpture = await SculpturesStation.setup(skullBlock, ctx)
    skullSculpture.position = new Vector3(0, 0, 20)

    const linksSculpture = await SculpturesStation.setup(linksBlock, ctx)
    linksSculpture.position = new Vector3(15, 0, 5)
    linksSculpture.rotate(Vector3.Up(), Math.PI / 2)

    WavesStation.setup(ctx)

    const trampGame = await TrampStation.setup(ctx)
    trampGame.position.y = 6.2
    

    // Story board
    const storyTextMesh = textPanelMesh({ width: 1024, height: 500 }, scene)
    storyTextMesh.position = new Vector3(0, 4.5, 7.4)
    storyTextMesh.scaling = new Vector3(5, 5, 1)
    storyTextMesh.setText('Welcome speed sculptors!|Complete each sculpture in|4:04 without any mistakes|to earn a high score')

    // Billboard
    const scoreboardTextMesh = textPanelMesh({width: 1920, height: 1080}, scene)

    scoreboardTextMesh.position = new Vector3(-7.34, 3, 2)
    scoreboardTextMesh.scaling = new Vector3(8, 8, 1)
    scoreboardTextMesh.rotation = new Vector3(0, 3 / 2 * Math.PI, 0)
    scene.registerBeforeRender(() => {
        let text = 'Scoreboard|'
        text += 'Name^Percent^Mistakes^Timer'
        ctx.sculptures = ctx.sculptures || []
        if (ctx.myStorage.isSupported) {
            ctx.sculptures.forEach((name) => {
                const sculptureString = ctx.myStorage.get(name)
                if (!sculptureString) return
                const [particles, highPercent, lowMistakes, timerRemaining] = sculptureString.split('|')
                if (particles) {
                    text += `|${name}^${highPercent}^${lowMistakes}^${timerRemaining}`
                }
            })
        }
        scoreboardTextMesh.setText(text)
    })

    // Music
    const mySongData = zzfxM(...Canon.song)
    const myAudioNode = zzfxP(...mySongData)
    myAudioNode.loop = true
}

export function enter(ctx) {

}

export function exit(ctx) {
    // Remove scene stuff
}

export function execute(ctx, delta, time) {
    // Used to advance animations on Materials and meshes
}
