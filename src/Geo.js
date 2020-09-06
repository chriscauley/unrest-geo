import { range } from 'lodash'

import { mod } from '../utils'
import Look from './Look'

const geo_cache = {}

class Geo {
  constructor(x0, x_max, y0, y_max) {
    if (x_max === undefined) {
      x_max = x0
    }
    if (y0 === undefined) {
      y_max = x_max - 1
      x_max = x0 - 1
      x0 = 0
      y0 = 0
    }

    const W = Math.abs(x_max - x0) + 1
    const H = Math.abs(y_max - y0) + 1

    // constants
    Object.assign(this, { x0, y0, W, H })

    // cache tables
    Object.assign(this, {
      xys: [],
      indexes: [],
      AREA: W * H,
      _dindex_names: ['u', 'l', 'r', 'd'],
      _dindex_chars: ['^', '<', '>', 'v'],
      _dindex2char: {},
      _name2dindex: {},
      _dindex2name: {},
      dindexes: [-W, -1, 1, W], // u, l, r, d
      rot_dindexes: {
        [-W]: [-W, -1, 1, W], // u, l, r, d
        [W]: [W, 1, -1, -W], // d, l, r, u
        [1]: [1, -W, W, -1], // r, u, d, l
        [-1]: [-1, W, -W, 1], // l, d, u, r
      },
    })

    this.dindexes.forEach((dindex, i) => {
      const name = this._dindex_names[i]
      this._dindex2name[dindex] = name
      this._name2dindex[name] = dindex
      this._dindex2char[dindex] = this._dindex_chars[i]
    })

    this.CENTER = this.xy2index([
      Math.floor((this.x0 + this.W) / 2),
      Math.floor((this.y0 + this.H) / 2),
    ])

    range(y0, y_max + 1).forEach((y) =>
      range(x0, x_max + 1).forEach((x) => {
        const xy = [x, y]
        this.xys.push(xy)
        this.indexes.push(this.xy2index(xy))
      }),
    )

    this.look = Look(this)
  }

  index2xy = (i) => [mod(i, this.W), Math.floor(i / this.W)]
  xy2index = (xy) => mod(xy[0] + xy[1] * this.W, this.AREA)
  print(board, options = {}) {
    const {
      from_xy = [this.x0, this.y0],
      to_xy = [this.x0 + this.W-1, this.y0 + this.H-1],
      delimiter = '',
      empty = ' ',
      extras,
      title,
    } = options
    const xs = range(from_xy[0], to_xy[0] + 1)
    const ys = range(from_xy[1], to_xy[1] + 1)
    const lines = ys.map((y) =>
      xs
        .map((x) => board[this.xy2index([x, y])])
        .map((s) => (s === undefined ? empty : s))
        .join(delimiter),
    )
    if (extras) {
      extras.forEach((e, i) => (lines[i] += '\t' + e))
    }
    title && lines.unshift(title)
    return lines.join('\n')
  }
  inBounds(xy) {
    return (
      xy[0] >= this.x0 && xy[0] < this.x0 + this.W && xy[1] >= this.y0 && xy[1] < this.y0 + this.H
    )
  }
  slice(xy, W, H) {
    const out = []
    const ys = range(xy[1], xy[1] + H)
    const xs = range(xy[0], xy[0] + W)
    ys.forEach((y) => xs.forEach((x) => out.push(this.xy2index([x, y]))))
    return out
  }
  floorDindex(dindex) {
    // if dindex is a multiple of W it is in thy y direction
    // otherwise it is in the x direction
    return (dindex % this.W === 0 ? this.W : 1) * Math.sign(dindex)
  }
}

export default (x0, x_max, y0, y_max) => {
  // since geo's are meant to be deterministic with the above parameters they can be cached
  const key = `${x0},${x_max},${y0},${y_max}`
  geo_cache[key] = geo_cache[key] || new Geo(x0, x_max, y0, y_max)
  return geo_cache[key]
}
