import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

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

export function Win() {
  return (
    <Modal title="You Win">
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
