import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import auth from '@unrest/react-auth'
import sprites from './sprites'
import minesweeper from './minesweeper'

const keyMap = {
  TOGGLE_HELP: ['/', '?', 'shift+?'],
}

const App = () => {
  const handlers = {}
  return (
    <HashRouter>
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
      <Route path="/sprites/" component={sprites.Routes} />
      <Route path="/minesweeper/" component={minesweeper.Routes} />
      <div className="bg-white rounded px-4">
        <auth.Routes />
      </div>
      <Route exact path="/">
        <Redirect to="/minesweeper/" />
      </Route>
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
