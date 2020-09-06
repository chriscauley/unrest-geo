import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import { HashRouter, Route } from 'react-router-dom'
import sprites from './sprites'

const keyMap = {
  TOGGLE_HELP: ['/', '?', 'shift+?'],
}

const App = () => {
  const handlers = {
  }
  return (
    <HashRouter>
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
      <Route path="/sprites/" component={sprites.Routes} />
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
