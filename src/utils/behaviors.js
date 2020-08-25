export function addGrabbable(model) {
    Object.assign(model, {
        startInteraction(controllerMesh) {
            this.setParent(controllerMesh)
        },
        endInteraction() {
            this.setParent(null)
        }
    })
}
