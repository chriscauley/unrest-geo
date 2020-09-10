import { pick } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { post } from '@unrest/core'
import css from '@unrest/css'

import { useFlag, FlagPicker } from '../settings'
import api from '../api'

function Modal({ title, children }) {
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} />
      <div className={css.modal.content()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}

export function Win({ game }) {
  const [_, setState] = React.useState()
  const { flag } = useFlag()
  if (game.flag !== flag) {
    game.flag = flag
    const data = pick(game, ['actions', 'flag', 'key'])
    api.leaderboards.markStale()
    post('/api/complete_game/', data).then(() => setState(Math.random()))
  }
  return (
    <Modal title="You Win">
      <div className="pb-4">You have claimed victory for {flag}</div>
      <div>
        Change flags?
        <FlagPicker onChange={() => setState(Math.random())} />
      </div>
      <Link to="/minesweeper/" className={css.button()}>
        Play another
      </Link>
    </Modal>
  )
}

export function Lose({ game }) {
  return (
    <Modal title="Gameover">
      <a onClick={game.restart} className={css.button('mr-2')}>
        Try again
      </a>
      <Link to="/minesweeper/" className={css.button()}>
        Play a different map
      </Link>
    </Modal>
  )
}
