import React from 'react'
import Geo, { random } from '../../../src'
import { allowMine, placeMine, placeHole, click, _var } from './game'

const game_cache = {}

export default (W, H, M, x, y) => {
  const [_, setState] = React.useState()
  const key = `${W}x${H}x${M}x${x},${y}`
  if (x === undefined) {
    return
  }
  if (!game_cache[key]) {
    W++
    H++
    x++
    y++
    const S = y * W + x
    const geo = Geo(W, H)
    const game = {
      mines: {},
      near: {},
      geo,
      rows: [],
      visible: {},
      mode: 'classic',
      scores: {
        miss: 0,
        mine: 0,
        flag: M,
      },
      look(index) {
        return geo.look('box', index, 1, 1)
      },
      recount: () => {
        let count = 0
        Object.keys(game.visible).forEach((index) => {
          if (game.visible[index] === undefined) {
            delete game.visible[index]
          } else {
            count++
          }
        })
        game.scores.click = W * H - count
        return game.scores.click
      },
    }
    game_cache[key] = game
    let count = 0
    let fails = 1
    let row
    geo.indexes
      .filter((i) => i < geo.W || i % geo.W === 0)
      .forEach((i) => (game.mines[i] = _var.WALL))
    geo.indexes.forEach((i) => {
      game.near[i] = 0
      if (i % W === 0) {
        game.rows.push((row = []))
      }
      row.push(i)
    })
    placeHole(game, S)
    while (count < M) {
      const index = random.int((S + count + fails) * M, geo.indexes.length)
      if (allowMine(game, index)) {
        placeMine(game, index)
        count++
      } else {
        fails++
      }
      if (fails > M * 2) {
        throw `Unable to place ${M} mines in ${fails} turns`
      }
    }
    geo.rows = []
    Object.entries(game.mines)
      .filter(([_, value]) => value === _var.HOLE)
      .forEach(([index, _]) => {
        click(game, index, true)
        game.visible[index] = game.near[index]
      })
    Object.entries(game.mines)
      .filter(([_, value]) => value === _var.WALL)
      .forEach(([index, _]) => (game.visible[index] = _var.WALL))
    game.recount()
  }
  const game = (window.g = game_cache[key])
  game.update = () => setState(game.recount())
  return game
}