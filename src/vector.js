// a collection of vector operations.
// # TODO AD after deploy comment out unused parts
export const ZERO = [0, 0]

const add = ([dx, dy], [dx2, dy2]) => [dx + dx2, dy + dy2]

const subtract = ([dx, dy], [dx2, dy2]) => [dx - dx2, dy - dy2]

const magnitude = ([dx, dy]) => Math.abs(dx) + Math.abs(dy)

const sign = ([dx, dy]) => [Math.sign(dx), Math.sign(dy)]

// export const iterDifference = (dxy, dxy2) => {
//   const [dx, dy] = subtract(dxy, dxy2)
//   const [sx, sy] = sign([dx, dy])
//   const out = []
//   _.range(dx).forEach(() => out.push([sx, 0]))
//   _.range(dy).forEach(() => out.push([0, sy]))
//   return out
// }

// const splitDxy = ([dx, dy], range = 1) =>
//   _.flatten(
//     _.range(1, range + 1).map(i => [[dy * i, dx * i], [-dy * i, -dx * i]]),
//   )

export default {
  // isZero: ([dx, dy]) => !dx && !dy,
  times: (xy, num) => [xy[0] * num, xy[1] * num],
  // sum: dxys => dxys.reduce(add, [...ZERO]),
  // getDistance: (dxy1, dxy2) => magnitude(subtract(dxy1, dxy2)),
  // turn: ([dx, dy], dir) => [-dy * dir, dx * dir],
  // floor: dxy => [Math.floor(dxy[0]), Math.floor(dxy[1])],
  magnitude,
  sign,
  subtract,
  add,
  // iterDifference,
  // splitDxy,
}
