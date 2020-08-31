/* eslint-disable no-undef */
// Taken from https://nme.babylonjs.com/#VJUZ7I#2
const colorHeightNME = function() {
    const nodeMaterial = new BABYLON.NodeMaterial('node')

    // InputBlock
    const position = new BABYLON.InputBlock('position')
    position.setAsAttribute('position')

    // TransformBlock
    const WorldPos = new BABYLON.TransformBlock('WorldPos')
    WorldPos.complementZ = 0
    WorldPos.complementW = 1

    // InputBlock
    const World = new BABYLON.InputBlock('World')
    World.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World)

    // VectorSplitterBlock
    const VectorSplitter = new BABYLON.VectorSplitterBlock('VectorSplitter')

    // VectorMergerBlock
    const VectorMerger = new BABYLON.VectorMergerBlock('VectorMerger')

    // AddBlock
    const Add = new BABYLON.AddBlock('Add')

    // RemapBlock
    const Remap = new BABYLON.RemapBlock('Remap')
    Remap.sourceRange = new BABYLON.Vector2(0, 1)
    Remap.targetRange = new BABYLON.Vector2(-0, 20)

    // TextureBlock
    const Texture = new BABYLON.TextureBlock('Texture')

    // InputBlock
    const uv = new BABYLON.InputBlock('uv')
    uv.setAsAttribute('uv')

    // GradientBlock
    const Gradient = new BABYLON.GradientBlock('Gradient')
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0, new BABYLON.Color3(0.0196078431372549, 0.0196078431372549, 0.4235294117647059)))
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0.22, new BABYLON.Color3(0.047058823529411764, 0.6549019607843137, 0.8274509803921568)))
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0.35, new BABYLON.Color3(0.8313725490196079, 0.7215686274509804, 0.5254901960784314)))
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0.52, new BABYLON.Color3(0.0196078431372549, 0.47843137254901963, 0.16470588235294117)))
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0.61, new BABYLON.Color3(0.3058823529411765, 0.22745098039215686, 0.13333333333333333)))
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0.86, new BABYLON.Color3(0.5450980392156862, 0.3411764705882353, 0.16470588235294117)))
    Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(1, new BABYLON.Color3(1, 1, 1)))

    // FragmentOutputBlock
    const FragmentOutput = new BABYLON.FragmentOutputBlock('FragmentOutput')

    // TransformBlock
    const WorldPosViewProjectionTransform = new BABYLON.TransformBlock('WorldPos * ViewProjectionTransform')
    WorldPosViewProjectionTransform.complementZ = 0
    WorldPosViewProjectionTransform.complementW = 1

    // InputBlock
    const ViewProjection = new BABYLON.InputBlock('ViewProjection')
    ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection)

    // VertexOutputBlock
    const VertexOutput = new BABYLON.VertexOutputBlock('VertexOutput')

    // Connections
    position.output.connectTo(WorldPos.vector)
    World.output.connectTo(WorldPos.transform)
    WorldPos.xyz.connectTo(VectorSplitter.xyzIn)
    VectorSplitter.x.connectTo(VectorMerger.x)
    VectorSplitter.y.connectTo(Add.left)
    uv.output.connectTo(Texture.uv)
    Texture.r.connectTo(Remap.input)
    Remap.output.connectTo(Add.right)
    Add.output.connectTo(VectorMerger.y)
    VectorSplitter.z.connectTo(VectorMerger.z)
    VectorMerger.xyz.connectTo(WorldPosViewProjectionTransform.vector)
    ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform)
    WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector)
    Texture.r.connectTo(Gradient.gradient)
    Gradient.output.connectTo(FragmentOutput.rgb)

    // Output nodes
    nodeMaterial.addOutputNode(VertexOutput)
    nodeMaterial.addOutputNode(FragmentOutput)
    nodeMaterial.build()
    return nodeMaterial
}
export { colorHeightNME }
