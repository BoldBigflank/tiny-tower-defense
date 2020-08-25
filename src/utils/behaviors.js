export function addGrabbable(model) {
    Object.assign(model, {
        startInteraction(controllerMesh) {
            this.setParent(controllerMesh)
        },
        moveInteraction(controllerMesh) {
            console.log('moveInteraction')
        },
        endInteraction() {
            this.setParent(null)
        }
    })
}

export function addSpinnable(model, options) {
    Object.assign(model, {
        startInteraction(controllerMesh) {
            // Watch the controllerMesh
        },
        moveInteraction(controllerMesh) {
            // Rotate based on the pointer's position
        },
        endInteraction() {
            // Stop  updating
        }
    })
}