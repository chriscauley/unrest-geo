import React from 'react'
import { Link, Route, Switch, useRouteMatch, useHistory } from 'react-router-dom'
import css from '@unrest/css'

import { range } from '../../../src'
import { SettingsLink, useFlag } from '../settings'
import { click, flag, prepScores, _var } from './game'
import useGame from './useGame'
import { Win, Lose } from './gameover'

function Game({ match }) {
  const { W, H, M, x, y } = parseParams(match)

  const game = useGame(W, H, M, x, y)
  useFlag() // ensures there's css for flag
  const history = useHistory()
  let rows
  let after = ''
  let scores = []
  if (!game) {
    rows = range(H).map((y) =>
      range(W).map((x) => ({
        onClick: () => history.push(`${x},${y}/`),
        index: x + y * H,
      })),
    )
  } else {
    after = ` @ ${x},${y}`
    const onClick = (i) => (e) => {
      e.preventDefault()
      if (!game.win && !game.lose) {
        const action = e.buttons === 1 || e.shiftKey ? flag : click
        action(game, i)
        game.update()
      }
    }
    rows = game.rows.map((indexes) =>
      indexes.map((index) => ({
        index,
        value: game.visible[index],
        onClick: onClick(index),
      })),
    )
    scores = prepScores(game)
  }

  const { win, lose } = game || {}

  return (
    <div className="minesweeper">
      {lose && <Lose game={game} />}
      {win && <Win game={game} />}
      <div className="flex items-center justify-between p-4 bg-white sticky top-0 z-10">
        <div className="mr-8">
          <Link to="/" className={css.link('mr-4')}>
            Home
          </Link>
          {`Map: ${W}x${H}x${M}${after}`}
        </div>
        <div className="scores">
          {scores.map((i) => (
            <div key={i.char} className="score">
              <span className={`cell cell-${i.char}`} /> {i.value}
            </div>
          ))}
          <SettingsLink />
        </div>
      </div>
      <div className="geo geo-xy">
        {rows.map((row, i_row) => (
          <div className="row" key={i_row}>
            {row.map((cell) => (
              <div
                className={`cell cell-${cell.value} index-${cell.index}`}
                key={cell.index}
                onClick={cell.onClick}
              >
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const parseParams = (match) => {
  const out = {}
  const { dimension, seed } = match.params
  if (dimension) {
    const d_match = dimension.match(/^(\d+)x(\d+)x(\d+)$/)
    if (d_match) {
      const [_, W, H, M] = d_match.map((i) => parseInt(i))
      Object.assign(out, { W, H, M })
    }
  }
  if (seed) {
    const s_match = seed.match(/^(\d+),(\d+)$/)
    if (s_match) {
      const [_, x, y] = s_match.map((i) => parseInt(i))
      Object.assign(out, { x, y })
    }
  }
  return out
}

function Index() {
  const links = {
    trivial: '6x6x1/',
    easy: '9x9x12/',
    medium: '16x16x40/',
    hard: '16x32x99/',
  }
  return (
    <div className="bg-white rounded p-4">
      <h1 className="h3">Select a difficulty</h1>
      {Object.entries(links).map(([name, url]) => (
        <Link key={url} to={url} className="p-2 hover:bg-gray-100 block">
          {name}
        </Link>
      ))}
    </div>
  )
}

export default {
  Routes: function Routes() {
    const { path } = useRouteMatch()
    return (
      <Switch>
        <Route path={path + ':dimension/:seed/'} component={Game} />
        <Route path={path + ':dimension/'} component={Game} />
        <Route path={path} component={Index} />
      </Switch>
    )
  },
}
