export function addGrabbable(model) {
    Object.assign(model, {
        startInteraction(pointerInfo, controllerMesh, context) {
            this.setParent(controllerMesh)
        },
        moveInteraction(pointerInfo, context) {
            console.log('moveInteraction')
        },
        endInteraction() {
            this.setParent(null)
        }
    })
}

export function addSpinnable(model, options) {
    const MAX_ANGLE = 32
    const DELTA_ANGLE = 4
    Object.assign(model, {
        startInteraction(pointerInfo, controllerMesh, ctx) {
            // Watch the controllerMesh
            const pickedPoint = pointerInfo.pickInfo.pickedPoint
            this.startPoint = new BABYLON.Vector2(pickedPoint.x, pickedPoint.y)
            let delta = (pickedPoint.x > 0) ? DELTA_ANGLE : -1 * DELTA_ANGLE
            if (Math.abs(ctx.sailing.rotation + delta) > MAX_ANGLE) return
            const node = this.rotate(new BABYLON.Vector3(0, 0, 1), (pickedPoint.x > 0) ? -1 * Math.PI / 8 : Math.PI / 8 )
            ctx.sailing.rotation += delta
        },
        moveInteraction(pointerInfo, pickedMesh, ctx) {
            // TODO: Make it rotate based on your movement around the axis
        },
        endInteraction() {
            // Stop  updating
        }
    })
}

export function addAnchorControl(model, options) {
    Object.assign(model, {
        startInteraction(pointerInfo, controllerMesh, ctx) {
            ctx.sailing.speed = (ctx.sailing.speed === 0) ? 12 : 0
            console.log('setting speed', ctx.sailing.speed)
        }
    })
}