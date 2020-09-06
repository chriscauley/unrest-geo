import React from 'react'
import {makeSprites} from './Hexes'


export default function GridDemo() {
  const pieces = [1, 2, 3, 4, 5, 6]
  const players = [1, 2]
  makeSprites()
  return (
    <div className="geo geo-hex large">
      {players.map(player => (
        <div className="row" key={player}>
          {pieces.map(p => (
            <div className="item" key={p}>
              <div className="content">
                <div className={`cell cell-player_${player}`}>{p}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}