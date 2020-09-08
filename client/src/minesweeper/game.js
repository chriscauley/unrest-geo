import { range, random } from '../../../src'
import { constructor } from 'xorshift'

const LIVES = 'L'
const MINE = 'M'
const WALL = 'W'
const FLAG = 'F'
const HOLE = 'H'
const CLICK = 'A'
const ZERO = 0 // specifically, zero as number of mines to display
const MAX_NEIGHBORS = 5
const SCORE_MAP = { CLICK, FLAG, LIVES }

export const _var = { MINE, WALL, FLAG, HOLE, CLICK, ZERO }

export const allowMine = (game, index) => {
  if (game.mines[index]) {
    return false
  }
  const neighbors = game.look(index)
  return neighbors.find((i) => game.near[i] <= MAX_NEIGHBORS) !== undefined
}

export const placeMine = (game, index) => {
  game.mines[index] = MINE
  game.look(index).forEach((i) => game.near[i]++)
}

export const placeHole = (game, index) => {
  game.mines[index] = HOLE

  let count = 0
  let fails = 0
  const goal = (game.geo.W + game.geo.H) / 4
  const targets = game.geo.look('circle', index, 1, 1).filter((i) => allowMine(game, i))
  while (count < goal) {
    const target = targets.splice(random(count + fails + 1 + index) % targets.length, 1)[0]
    if (allowMine(game, target)) {
      game.mines[target] = HOLE
      game.geo
        .look('circle', target, 1, 1)
        .filter((i) => allowMine(game, i))
        .forEach((i) => {
          targets.push(i)
        })
      count++
    } else {
      fails++
    }
    if (fails > goal * 2) {
      throw `Unable to place ${goal} mines in ${fails} turns`
    }
  }
  targets.forEach((i) => (game.mines[i] = HOLE))
}

export const click = (game, index, force) => {
  index = parseInt(index)
  if (game.visible[index] !== undefined || game.mines[index] === WALL) {
    if (!force) {
      return
    }
  }
  if (game.mines[index] === MINE) {
    game.scores.lives--
    game.scores.flag--
  }
  game.visible[index] = game.mines[index] || game.near[index]
  if (game.near[index] === ZERO) {
    game.look(index).forEach((i) => click(game, i))
  }
}

export const flag = (game, index) => {
  if (game.visible[index] === FLAG) {
    delete game.visible[index]
    game.scores.flag++
  } else if (game.visible[index] === undefined) {
    game.visible[index] = FLAG
    game.scores.flag--
  }
}

export const prepScores = (game) => {
  return Object.entries(SCORE_MAP).map(([NAME, char]) => ({
    NAME,
    char,
    name: NAME.toLowerCase(),
    value: game.scores[NAME.toLowerCase()],
  }))
}
