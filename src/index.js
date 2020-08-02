import {
    init, initKeys, keyPressed, Sprite, GameLoop
} from 'kontra'
import './style.scss'

const { canvas, context } = init()

let sprites = []

const sprite = Sprite({
    anchor: {x: 0.5, y: 0.5 },
    type: 'bug',
    x: 100, // starting x,y position of the sprite
    y: 80,
    color: 'red', // fill color of the sprite rectangle
    width: 20, // width and height of the sprite rectangle
    height: 40,
    dx: 1, // move the sprite 2px to the right every frame
    update(dt) {
        this.advance()
        if (this.x > this.context.canvas.width) {
            this.x = -this.width
        }
    }
})

sprites.push(sprite)

const laser = {
    x0: 0,
    y0: 0,
    x1: 100,
    y1: 100,
    ttl: 6,
    color: 'white',
    width: 10,
    render: function() {
        const ctx = this.context
        ctx.save()
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width
        ctx.beginPath()
        ctx.moveTo(this.x0, this.y0)
        ctx.lineTo(this.x1, this.y1)
        ctx.stroke()
        ctx.restore()
    }
}

const shooter = Sprite({
    x: 200,
    y: 120,
    anchor: {x: 0.5, y: 0.5 },
    width: 20,
    height: 20,
    color: 'blue',
    dx: 0,
    shotCooldown: 20,
    range: 120,
    update(dt) {
        if (keyPressed('right')) {
            this.dx = 2
        } else if (keyPressed('left')) {
            this.dx = -2
        } else {
            this.dx = 0
        }

        if (keyPressed('up')) {
            this.dy = -2
        } else if (keyPressed('down')) {
            this.dy = 2
        } else {
            this.dy = 0
        }
        this.advance()

        // If close enough, shoot a laser
        this.shotCooldown++
        if (this.shotCooldown < 60) return

        sprites.filter((s) => s.type === 'bug').find((bug) => {
            const inRange = Math.hypot(bug.x - this.x, bug.y - this.y) < this.range
            if (inRange) {
                const l = Sprite(laser)
                l.x0 = this.x
                l.y0 = this.y
                l.x1 = bug.x
                l.y1 = bug.y
                sprites.push(l)
                this.shotCooldown = 0
                return true // break out of the loop
            }
            return false
        })
    }
})
sprites.push(shooter)

const loop = GameLoop({ // create the main game loop
    update(dt) { // update the game state
        sprites.forEach((sprite) => sprite.update(dt))
        sprites = sprites.filter((s) => s.isAlive())
    },
    render() { // render the game state
        sprites.forEach((sprite) => sprite.render())
    }
})

initKeys()
loop.start() // start the game
