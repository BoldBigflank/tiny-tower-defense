import { chest } from './models'
import { intersectDrawings } from './meshGenerator'

const MODEL_TYPES = {
    INTERSECT: 'intersect'
}

const MODEL_BEHAVIORS = {
    'Grabbable': 0
}

const mapObject = [
    {
        type: MODEL_TYPES.INTERSECT,
        pos: "0,1,0",
        model: chest,
        options: [MODEL_BEHAVIORS.Grabbable]
    }
]

export { mapObject }