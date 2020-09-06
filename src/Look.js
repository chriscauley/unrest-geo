import { range } from 'lodash'
import { assert } from '../utils'
import Shapes from './Shapes'

export default (geo) => {
  const shapes = Shapes(geo)
  const make = (shape, dist) => {
    const R = 1
    if (look[shape][R][dist]) {
      return
    }
    if (dist > 0 && !look[shape][R][dist - 1]) {
      make(shape, dist - 1)
    }
    if (shape.startsWith('__')) {
      // dunder means "outer shell of look"
      geo.dindexes.forEach((dindex) => {
        look[shape][dindex][dist] = shapes[shape.slice(2)](dist, dindex)
      })
    } else {
      if (!look['__' + shape][R][dist]) {
        // need outer shells to make filled looks
        make('__' + shape, dist)
      }
      geo.dindexes.forEach((dindex) => {
        look[shape][dindex][dist] = []
        range(dist + 1).forEach((_dist) => {
          look[shape][dindex][dist] = look[shape][dindex][dist].concat(
            look['__' + shape][dindex][_dist],
          )
        })
      })
    }
  }

  const look = (shape, index, dist, dindex) => {
    // TODO are these string interpolations a performance issue?
    assert(look[shape][dindex], `Invalid dindex: ${dindex}`)
    assert(Number.isInteger(dist), `Distance must be an integer not '${typeof dist}`)
    make(shape, dist) // idempotent
    return look[shape][dindex][dist].map((dindex) => index + dindex)
  }

  Shapes.list.forEach((shape) => {
    look[shape] = {}
    geo.dindexes.forEach((dindex) => {
      look[shape][dindex] = [[]] // all geometries only see nothing at range 0
    })
    make(shape, 1)
  })

  return look
}
