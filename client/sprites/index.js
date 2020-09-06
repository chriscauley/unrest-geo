import React from 'react'
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'

import Hexes, { makeSprites } from './Hexes'
import Tiles from './Tiles'

const links = [
  ['tiles', Tiles],
  ['hexes', Hexes],
]

function Index({ path }) {
  return (
    <div className="w-full flex">
      <ul className="browser-default m-4">
        {links.map(([link, _]) => (
          <li key={link}>
            <Link to={`${path}${link}/`}>{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default {
  makeSprites,
  Routes() {
    console.log(1)
    const { path } = useRouteMatch()
    return (
      <div className="overflow-auto">
        <Switch>
          <Route exact path={path}>
            <Index path={path} />
          </Route>
          {links.map(([link, Component]) => (
            <Route path={`${path}${link}/`} component={Component} key={link} />
          ))}
        </Switch>
      </div>
    )
  },
}
