/* eslint-disable no-undef */
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

// TransformBlock
const Worldnormal = new BABYLON.TransformBlock('World normal')
Worldnormal.complementZ = 0
Worldnormal.complementW = 0

// MultiplyBlock
const Multiply = new BABYLON.MultiplyBlock('Multiply')

// TextureBlock
const Texture = new BABYLON.TextureBlock('Texture')

// InputBlock
const uv = new BABYLON.InputBlock('uv')
uv.setAsAttribute('uv')

// RemapBlock
const Remap = new BABYLON.RemapBlock('Remap')
Remap.sourceRange = new BABYLON.Vector2(0, 1)
Remap.targetRange = new BABYLON.Vector2(-2, 2)

// ScaleBlock
const Scale = new BABYLON.ScaleBlock('Scale')

// StepBlock
const Step = new BABYLON.StepBlock('Step')

// ColorSplitterBlock
const ColorSplitter = new BABYLON.ColorSplitterBlock('ColorSplitter')

// InputBlock
const color = new BABYLON.InputBlock('color')
color.setAsAttribute('color')

// InputBlock
const Float = new BABYLON.InputBlock('Float')
Float.value = 0.5
Float.min = 0
Float.max = 0
Float.isBoolean = false
Float.matrixMode = 0
Float.animationType = BABYLON.AnimatedInputBlockTypes.None
Float.isConstant = false
Float.visibleInInspector = false

// ScaleBlock
const Scale1 = new BABYLON.ScaleBlock('Scale')

// MultiplyBlock
const Multiply1 = new BABYLON.MultiplyBlock('Multiply')

// GradientBlock
const Gradient = new BABYLON.GradientBlock('Gradient')
Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(0, new BABYLON.Color3(0, 0, 0)))
Gradient.colorSteps.push(new BABYLON.GradientBlockColorStep(1, new BABYLON.Color3(1, 1, 1)))

// DotBlock
const Dot = new BABYLON.DotBlock('Dot')

// NormalizeBlock
const Normalize = new BABYLON.NormalizeBlock('Normalize')

// AddBlock
const Add = new BABYLON.AddBlock('Add')

// NegateBlock
const Negate = new BABYLON.NegateBlock('Negate')

// NormalizeBlock
const Normalize1 = new BABYLON.NormalizeBlock('Normalize')

// LightInformationBlock
const Lightinformation = new BABYLON.LightInformationBlock('Light information')

// NormalizeBlock
const Normalize2 = new BABYLON.NormalizeBlock('Normalize')

// ViewDirectionBlock
const Viewdirection = new BABYLON.ViewDirectionBlock('View direction')

// InputBlock
const cameraPosition = new BABYLON.InputBlock('cameraPosition')
cameraPosition.setAsSystemValue(BABYLON.NodeMaterialSystemValues.CameraPosition)

// GradientBlock
const Gradient1 = new BABYLON.GradientBlock('Gradient')
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0, new BABYLON.Color3(0.0196078431372549, 0.023529411764705882, 0.2196078431372549)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.3, new BABYLON.Color3(0.050980392156862744, 0.06274509803921569, 0.4666666666666667)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.48, new BABYLON.Color3(0.10980392156862745, 0.615686274509804, 0.6588235294117647)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.5, new BABYLON.Color3(0.7450980392156863, 0.7098039215686275, 0.611764705882353)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.52, new BABYLON.Color3(0.19607843137254902, 0.803921568627451, 0.33725490196078434)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.7, new BABYLON.Color3(0.3607843137254902, 0.803921568627451, 0.19607843137254902)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.75, new BABYLON.Color3(0.4470588235294118, 0.35294117647058826, 0.11372549019607843)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.9, new BABYLON.Color3(0.6509803921568628, 0.5176470588235295, 0.1607843137254902)))
Gradient1.colorSteps.push(new BABYLON.GradientBlockColorStep(0.92, new BABYLON.Color3(1, 1, 1)))

// FragmentOutputBlock
const FragmentOutput = new BABYLON.FragmentOutputBlock('FragmentOutput')

// AddBlock
const Add1 = new BABYLON.AddBlock('Add')

// VectorSplitterBlock
const VectorSplitter = new BABYLON.VectorSplitterBlock('VectorSplitter')

// VectorMergerBlock
const VectorMerger = new BABYLON.VectorMergerBlock('VectorMerger')

// TransformBlock
const WorldPosViewProjectionTransform = new BABYLON.TransformBlock('WorldPos * ViewProjectionTransform')
WorldPosViewProjectionTransform.complementZ = 0
WorldPosViewProjectionTransform.complementW = 1

// InputBlock
const ViewProjection = new BABYLON.InputBlock('ViewProjection')
ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection)

// VertexOutputBlock
const VertexOutput = new BABYLON.VertexOutputBlock('VertexOutput')

// NormalizeBlock
const Normalize3 = new BABYLON.NormalizeBlock('Normalize')

// InputBlock
const normal = new BABYLON.InputBlock('normal')
normal.setAsAttribute('normal')

// Connections
position.output.connectTo(WorldPos.vector)
World.output.connectTo(WorldPos.transform)
WorldPos.xyz.connectTo(VectorSplitter.xyzIn)
VectorSplitter.x.connectTo(VectorMerger.x)
VectorSplitter.y.connectTo(Add1.left)
uv.output.connectTo(Texture.uv)
Texture.r.connectTo(Remap.input)
Remap.output.connectTo(Scale.input)
color.output.connectTo(ColorSplitter.rgba)
ColorSplitter.r.connectTo(Step.value)
Float.output.connectTo(Step.edge)
Step.output.connectTo(Scale.factor)
Scale.output.connectTo(Add1.right)
Add1.output.connectTo(VectorMerger.y)
VectorSplitter.z.connectTo(VectorMerger.z)
VectorMerger.xyz.connectTo(WorldPosViewProjectionTransform.vector)
ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform)
WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector)
Texture.rgb.connectTo(Multiply.left)
normal.output.connectTo(Normalize3.input)
Normalize3.output.connectTo(Multiply.right)
Multiply.output.connectTo(Worldnormal.vector)
World.output.connectTo(Worldnormal.transform)
Worldnormal.xyz.connectTo(Normalize.input)
Normalize.output.connectTo(Dot.left)
WorldPos.output.connectTo(Lightinformation.worldPosition)
Lightinformation.direction.connectTo(Normalize1.input)
Normalize1.output.connectTo(Negate.value)
Negate.output.connectTo(Add.left)
WorldPos.output.connectTo(Viewdirection.worldPosition)
cameraPosition.output.connectTo(Viewdirection.cameraPosition)
Viewdirection.output.connectTo(Normalize2.input)
Normalize2.output.connectTo(Add.right)
Add.output.connectTo(Dot.right)
Dot.output.connectTo(Gradient.gradient)
Gradient.output.connectTo(Multiply1.left)
Texture.r.connectTo(Gradient1.gradient)
Gradient1.output.connectTo(Multiply1.right)
Multiply1.output.connectTo(Scale1.input)
Step.output.connectTo(Scale1.factor)
Scale1.output.connectTo(FragmentOutput.rgb)

// Output nodes
nodeMaterial.addOutputNode(VertexOutput)
nodeMaterial.addOutputNode(FragmentOutput)
nodeMaterial.build()
