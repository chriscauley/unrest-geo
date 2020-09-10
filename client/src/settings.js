import classNames from 'classnames'
import React from 'react'
import { useSelect } from '@unrest/core'
import css from '@unrest/css'

const flags = {
  'chequered-flag': '🏁',
  'triangular-flag': '🚩',
  'black-flag': '🏴',
  'white-flag': '🏳️',
  'rainbow-flag': '🏳️‍🌈',
  'transgender-flag': '🏳️‍⚧️',
  'pirate-flag': '🏴‍☠️',
}

const KEY = 'team__flag'

const getFlag = () => {
  return localStorage.getItem(KEY) || flags['chequered-flag']
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
  const setFlag = (char, onChange) => {
    localStorage.setItem(KEY, char)
    setState(Math.random())
    onChange && onChange(char)
  }
  return { flag, setFlag }
}

export const FlagPicker = ({ onChange }) => {
  const { flag, setFlag } = useFlag()
  const _cls = (char) =>
    classNames('text-xl p-2 m-2 rounded cursor-pointer', { 'border-2': char === flag })
  const set = (char) => () => setFlag(char, onChange)
  return (
    <div className="flex">
      {Object.values(flags).map((char) => (
        <div className={_cls(char)} key={char} onClick={set(char)}>
          {char}
        </div>
      ))}
    </div>
  )
}

export const SettingsLink = () => {
  const { open, childRef, toggle } = useSelect()
  return (
    <>
      {open && (
        <div className={css.modal.outer()}>
          <div className={css.modal.mask()} />
          <div className={css.modal.content.md()} ref={childRef}>
            <h2>Change Flag</h2>
            <FlagPicker />
            <button onClick={toggle}>close</button>
          </div>
        </div>
      )}
      <button onClick={toggle} className="ml-3 fa-2x fa fa-gear" />
    </>
  )
}
