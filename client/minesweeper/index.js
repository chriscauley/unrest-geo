import React from 'react'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import Geo, { random, range } from '../../src'

const game_cache = {}

const MINE = 'M'
const WALL = 'X'
const FLAG = 'F'
const HOLE = 'H'
const ZERO = 0 // specifically, zero as number of mines to display
const MAX_NEIGHBORS = 5

const allowMine = (game, index) => {
  if (game.mines[index]) {
    return false
  }
  const neighbors = game.look(index)
  return neighbors.find(i => game.near[i] <= MAX_NEIGHBORS) !== undefined
}

const placeMine = (game, index) => {
  game.mines[index] = MINE
  game.look(index).forEach(i => game.near[i]++)
}

const placeHole = (game, index) => {
  game.mines[index] = HOLE
  // game.look(index).forEach(i => {
  //   game.mines[i] = HOLE
  // })
}

const click = (game, index, force) => {
  index = parseInt(index)
  if (game.visible[index] !== undefined || game.mines[index] === WALL) {
    if (!force) {
      return
    }
  }
  if (game.mines[index] === MINE) {
    console.error("TODO punish for mine")
  }
  game.visible[index] = game.mines[index] || game.near[index]
  if (game.near[index] === ZERO) {
    game.look(index).forEach(i => click(game, i))
  }
}

const flag = (game, index) => {
  if (game.visible[index] !== undefined) {
    return
  }
  if (game.mines[index]) {
    game.visible[index] = FLAG
    // game.look(index).forEach(index2 => {
    //   const nearbyFlags = game.look(index2).filter(i => game.visible[i] === FLAG).length
    //   console.log(nearbyFlags, game.visible[index2])
    //   if (nearbyFlags === game.visible[index2]) {
    //     game.look(index2).forEach(i3 => click(game, i3))
    //   }
    // })
  } else {
    console.error("punish for miss")
  }
}

const useGame = (W, H, M, x, y) => {
  const [_, setState] = React.useState()
  const key = `${W}x${H}x${M}x${x},${y}`
  if (!game_cache[key]) {
    W ++
    H ++
    x ++
    y ++
    const S = y * H + x
    console.log(S)
    const geo = Geo(W, H)
    const game = {
      mines: {},
      near: {},
      geo,
      rows: [],
      visible: {},
      mode: 'classic',
      look(index) { return geo.look('box', index, 1, 1) }
    }
    game_cache[key] = game
    let count = 0
    let fails = 1
    let row
    geo.indexes.filter(i => i < geo.W || i % geo.W === 0).forEach(i=> game.mines[i] = WALL)
    geo.indexes.forEach(i => {
      game.near[i] = 0
      if (i % W === 0) {
        game.rows.push(row = [])
      }
      // if (game.mines[i] !== WALL) {
      row.push(i)
      // }
    })
    placeHole(game, S)
    while (count < M && fails <= M * 2) {
      const index = random.int((S+1) * M * count * fails, geo.indexes.length)
      if (allowMine(game, index)) {
        placeMine(game, index)
        count ++
      } else {
        fails ++
      }
    }
    geo.rows = []
    Object.entries(game.mines)
      .filter(([index, value])=> value === HOLE)
      .forEach(([index, _]) => click(game, index, true))
    Object.entries(game.mines)
      .filter(([index, value])=> value === WALL)
      .forEach(([index, _]) => game.visible[index] = WALL)
  }
  window.g = game_cache[key]
  game_cache[key].update = () => setState(Math.random())
  return game_cache[key]
}

function Game({W, H, M, x, y}) {
  const game = useGame(W, H, M, x, y)
  const rows = game.rows.map(
    indexes => indexes.map(
      index => ({
        index,
        value: game.visible[index]
      })
    )
  )
  const onClick = (i) => (e) => {
    e.preventDefault()
    if(e.buttons === 1 || e.shiftKey) {
      flag(game, i)
    } else {
      click(game, i)
    }
    game.update()
  }

  return (
    <div className="geo geo-xy minesweeper">
      {rows.map((row, i_row) => (
        <div className="row" key={i_row}>
          {row.map(cell => (
            <div className={`cell cell-${cell.value} index-${cell.index}`} key={cell.index} onClick={onClick(cell.index)}>{cell.value}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

const parsedParams = (Component) => ({match, ...props}) => {
  const { dimension, seed } = match.params
  if (dimension) {
    const d_match = dimension.match(/^(\d+)x(\d+)x(\d+)$/)
    if (d_match) {
      const [_, W, H, M] = d_match.map(i => parseInt(i))
      Object.assign(props, {W, H, M})
    }
  }
  if (seed) {
    const s_match = seed.match(/^(\d+),(\d+)$/)
    if (s_match) {
      const [_, x, y] = s_match.map(i => parseInt(i))
      Object.assign(props, {x, y})
    }
  }
  return <Component {...props} />
}

function PreGame({H, W}) {
  return (
    <div className="geo geo-xy">
      {range(H).map(y => (
        <div className="row" key={y}>
          {range(W).map(x=> (
            <Link className="cell" to={`${x},${y}/`} key={x} />
          ))}
        </div>
      ))}
    </div>
  )
}

function Index() {
  const links= {
    easy: '9x9x12/',
    medium: '16x16x40/',
    hard: '16x32x99/',
  }
  return (
    <ul>
      {Object.entries(links).map(([name, url]) => (
        <li key={url}><Link to={url}>{name}</Link></li>
      ))}
      <li/>
    </ul>
  )
}

export default {
  Routes() {
    const { path } = useRouteMatch()
    return (
      <div className="overflow-auto">
        <Switch>
          <Route path={path + ':dimension/:seed/'} component={parsedParams(Game)}/>
          <Route path={path + ':dimension/'} component={parsedParams(PreGame)}/>
          <Route path={path} component={Index} />
        </Switch>
      </div>
    )
  }
}