import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelect } from '@unrest/core'
import css from '@unrest/css'
import auth from '@unrest/react-auth'

const flags = {
  "chequered-flag": "🏁",
  "triangular-flag": "🚩",
  "black-flag": "🏴",
  "white-flag": "🏳️",
  "rainbow-flag": "🏳️‍🌈",
  "transgender-flag": "🏳️‍⚧️",
  "pirate-flag": "🏴‍☠️",
}

const KEY = 'team__flag'

const getFlag = () => {
  return localStorage.getItem(KEY) || flags["chequered-flag"]
}

export const useFlag = () => {
  const [_, setState] = React.useState()
  let style = document.getElementById(KEY)
  if (!style) {
    style = document.createElement('style')
    style.rel = 'stylesheet'
    document.head.appendChild(style)
  }
  const flag = getFlag()
  if (!style.innerHTML.includes(`"${flag}"`)) {
    style.innerHTML = `.minesweeper .cell-F:before { content: "${flag}" }`
  }
  const setFlag = (char, callback) => {
    localStorage.setItem(KEY, char)
    callback && callback(char)
    setState(char)
  }
  return { flag, setFlag }
}

export const FlagPicker = ({onChange}) => {
  const {flag, setFlag} = useFlag()
  const _cls = char => classNames(
    "text-xl p-2 m-2 rounded cursor-pointer",
    {'border-2': char === flag}
  )
  const set = char => () => setFlag(char, onChange)
  return (
    <div className="flex">
      {Object.entries(flags).map(([name, char]) => (
        <div className={_cls(char)} key={char} onClick={set(char)}>{char}</div>
      ))}
    </div>
  )
}

export const SettingsLink = () => {
  const { open, childRef, toggle } = useSelect()
  const { user, ...props } = auth.use()
  return (
    <>
      {open && (
        <div className={css.modal.outer()}>
          <div className={css.modal.mask()}/>
          <div className={css.modal.content.md()} ref={childRef}>
            <h2>Change Flag</h2>
            <FlagPicker/>
            <button onClick={toggle}>close</button>
          </div>
        </div>
      )}
      <button onClick={toggle} className="ml-3 fa-2x fa fa-gear" />
    </>
  )
}