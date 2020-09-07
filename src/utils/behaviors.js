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
            if (particleMesh.startInteraction) {
                particleMesh.startInteraction(pointerInfo, controllerMesh, context)
                sps.setParticles()
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
            const particleMesh = this.metadata.selectedParticles[pointerInfo.event.pointerId]
            const sps = this.metadata.sps
            if (particleMesh.endInteraction) {
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
            this.props = this.props || {}
            this.props.on = !this.props.on
            this.scaling = (this.props.on) ? BABYLON.Vector3.One() : BABYLON.Vector3.Zero()
        },
        moveInteraction(pointerInfo, context) {
            this.scaling = BABYLON.Vector3.Zero()
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