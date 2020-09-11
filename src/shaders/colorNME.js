/* eslint-disable no-undef */
// Taken from https://nme.babylonjs.com/#VJUZ7I#2

const steps = [0.0625, 0.1875, 0.3125, 0.4375, 0.5625, 0.6875, 0.8125, 0.9375]
const defaultColors = [
    new BABYLON.Color3(0.019, 0.019, 0.423),
    new BABYLON.Color3(0.047058823529411764, 0.6549019607843137, 0.8274509803921568),
    new BABYLON.Color3(0.8313725490196079, 0.7215686274509804, 0.5254901960784314),
    new BABYLON.Color3(0.0196078431372549, 0.47843137254901963, 0.16470588235294117),
    new BABYLON.Color3(0.3058823529411765, 0.22745098039215686, 0.13333333333333333),
    new BABYLON.Color3(0.5450980392156862, 0.3411764705882353, 0.16470588235294117),
    new BABYLON.Color3(1, 1, 1)
]
const colorNMEColors = function(colors) {
    const nodeMaterial = new BABYLON.NodeMaterial('node')

    // InputBlock
    const position = new BABYLON.InputBlock('position')
    position.setAsAttribute('position')

    // VectorSplitterBlock
    const VectorSplitter = new BABYLON.VectorSplitterBlock('VectorSplitter')

    // VectorMergerBlock
    const VectorMerger = new BABYLON.VectorMergerBlock('VectorMerger')

    // TransformBlock
    const WorldPos = new BABYLON.TransformBlock('WorldPos')
    WorldPos.complementZ = 0
    WorldPos.complementW = 1

    // InputBlock
    const World = new BABYLON.InputBlock('World')
    World.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World)

    // TransformBlock
    const WorldPosViewProjectionTransform = new BABYLON.TransformBlock('WorldPos * ViewProjectionTransform')
    WorldPosViewProjectionTransform.complementZ = 0
    WorldPosViewProjectionTransform.complementW = 1

    // InputBlock
    const ViewProjection = new BABYLON.InputBlock('ViewProjection')
    ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection)

    // VertexOutputBlock
    const VertexOutput = new BABYLON.VertexOutputBlock('VertexOutput')

    // RemapBlock
    const Remap = new BABYLON.RemapBlock('Remap')
    Remap.sourceRange = new BABYLON.Vector2(-0.5, 0.5)
    Remap.targetRange = new BABYLON.Vector2(0, 1)

    // GradientBlock
    const Gradient = new BABYLON.GradientBlock('Gradient')
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0, colors[0]))
    for (let i = 0; i < steps.length; i++) {
        let color = (i >= colors.length) ? colors[colors.length-1] : colors[i]
        Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(steps[i], color))
    }
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(1, colors[colors.length-1]))

    // FragmentOutputBlock
    const FragmentOutput = new BABYLON.FragmentOutputBlock('FragmentOutput')

    // Connections
    position.output.connectTo(VectorSplitter.xyzIn)
    VectorSplitter.x.connectTo(VectorMerger.x)
    VectorSplitter.y.connectTo(VectorMerger.y)
    VectorSplitter.z.connectTo(VectorMerger.z)
    VectorMerger.xyz.connectTo(WorldPos.vector)
    World.output.connectTo(WorldPos.transform)
    WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector)
    ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform)
    WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector)
    VectorSplitter.y.connectTo(Remap.input)
    Remap.output.connectTo(Gradient.gradient)
    Gradient.output.connectTo(FragmentOutput.rgb)

    // Output nodes
    nodeMaterial.addOutputNode(VertexOutput)
    nodeMaterial.addOutputNode(FragmentOutput)
    nodeMaterial.build()
    return nodeMaterial
}

const colorNME = function () {
    return colorNMEColors(defaultColors)
}

export { colorNME, colorNMEColors }
