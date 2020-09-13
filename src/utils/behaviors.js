export function addGrabbable(model) {
    Object.assign(model, {
        startInteraction(pointerInfo, controllerMesh, context) {
            this.props = this.props || {}
            this.props.pointers = this.props.pointers || 0
            if (this.props.pointers === 0) {
                this.setParent(controllerMesh)
            }
            this.props.pointers += 1
        },
        moveInteraction(pointerInfo, context) {
            // console.log('moveInteraction')
        },
        endInteraction() {
            this.props.pointers -= 1
            if (this.props.pointers === 0) {
                this.setParent(null)
            }
        }
    })
}

// Make individual events for a SolidParticleSystem Particle
export function addSPSEvents(model) {
    Object.assign(model, {
        getPickedParticle(pointerInfo) {
            const sps = this.metadata.sps
            const pickedParticle = sps.pickedParticle(pointerInfo.pickInfo)
            if (!pickedParticle) return null
            const { idx } = pickedParticle
            const particleMesh = sps.particles[idx]
            return particleMesh
        },
        startInteraction(pointerInfo, controllerMesh, context) {
            const particleMesh = this.getPickedParticle(pointerInfo)
            // TODO: Store particleMesh in a selectedMeshes
            this.metadata.selectedParticles = this.metadata.selectedParticles || {}
            this.metadata.selectedParticles[pointerInfo.event.pointerId] = particleMesh
            const sps = this.metadata.sps
            if (!this.metadata.parent.metadata.inProgress) return
            if (particleMesh && particleMesh.startInteraction) {
                particleMesh.startInteraction(pointerInfo, controllerMesh, context)
                sps.setParticles()
                sps.computeSubMeshes()
            }
        },
        moveInteraction(pointerInfo, context) {
            // pickedMesh is this
            // const particleMesh = this.metadata.selectedParticles[pointerInfo.event.pointerId]
            const particleMesh = this.getPickedParticle(pointerInfo)
            if (!particleMesh) return
            const sps = this.metadata.sps
            if (particleMesh.moveInteraction) {
                particleMesh.moveInteraction(pointerInfo, context)
                sps.setParticles()
            }
        },
        endInteraction(pointerInfo, context) {
            this.metadata.selectedParticles = this.metadata.selectedParticles || {}
            const particleMesh = this.metadata.selectedParticles[pointerInfo.event.pointerId]
            const sps = this.metadata.sps
            if (particleMesh && particleMesh.endInteraction) {
                particleMesh.endInteraction(pointerInfo, context)
                sps.setParticles()
            }
            this.metadata.selectedParticles[pointerInfo.event.pointerId] = undefined
        }
    })
}

export function addErasable(model) {
    Object.assign(model, {
        startInteraction(pointerInfo, controllerMesh, context) {
            let refresh = false
            this.props = this.props || {}
            this.props.state = 0
            const { correctState } = this.props
            if (correctState === 1) { // You chose poorly
                this.materialIndex = 1
                zzfx(1, .05, 1171, .01, 0, .08, 3, .74, 0, 1.9, -389, .06, 0, .1, 0, .1, 0, 1, .03, .59); // Blip 24
            } else { // You chose correctly
                this.scaling = BABYLON.Vector3.Zero()
                zzfx(1, .05, 1851, .01, 0, .07, 0, 1.06, 2.4, 0, 0, 0, 0, 0, 0, 0, .01, .09, .03, 0); // Blip 22
            }
        },
        moveInteraction(pointerInfo, context) {
            // this.scaling = BABYLON.Vector3.Zero()
        },
        endInteraction(pointerInfo, context) {
            // this.setParent(this.props.oldParent)
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
        moveInteraction(pointerInfo, ctx) {
            // pickedMesh is this
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
        }
    })
}