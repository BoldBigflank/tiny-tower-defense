// This is a collection of model data for the creation of meshes
// You must run these through a generator function to create a mesh

// Captain's Cabin walls
const cabinWalls = { color: '0.57,0.46,0.36', drawings: [{ polygons: [[[64, 16], [0, 16], [0, 0], [64, 0]], [[40, 13], [52, 13], [52, 4], [40, 4]], [[19, 13], [33, 13], [33, 4], [19, 4]]] }, { polygons: [[[32, 64], [10, 58], [12, 56], [32, 62]], [[16, 8], [0, 8], [0, 6], [16, 6]], [[10, 58], [0, 8], [3, 8], [12, 56]]], mirror: true }, { polygons: [[[32, 16], [0, 16], [0, 0], [32, 0]], [[17, 13], [28, 13], [28, 4], [17, 4]]], mirror: true }] }

const cabinFloor = { color: '0.57,0.46,0.36', drawings: [{ polygons: [] }, { polygons: [[[32, 62], [12, 56], [2, 6], [32, 6]]], mirror: true }, { polygons: [] }] }

// Items
const desk = { color: '0.48,0.37,0.32', drawings: [{ polygons: [[[32, 40], [12, 40], [12, 36], [32, 36]], [[32, 36], [16, 36], [16, 32], [32, 32]], [[24, 32], [20, 32], [16, 24], [20, 16], [16, 8], [20, 0], [24, 0], [28, 8], [24, 16], [28, 24]]], mirror: true }, { polygons: [[[32, 52], [12, 52], [4, 48], [0, 40], [0, 24], [4, 16], [12, 12], [32, 12]]], mirror: true }, { polygons: [[[32, 40], [0, 40], [0, 36], [32, 36]], [[32, 36], [4, 36], [4, 32], [32, 32]], [[12, 32], [8, 32], [4, 24], [8, 16], [4, 8], [8, 0], [12, 0], [16, 8], [12, 16], [16, 24]]], mirror: true }] }

// Ocean wave
const wave = { color: '1,1,1', drawings: [{ polygons: [] }, { polygons: [[[63, 32], [0, 32], [32, 29]]] }, { polygons: [[[32, 13], [0, 0], [32, 5]]], mirror: true }] }

export { cabinWalls, cabinFloor, desk, wave }
