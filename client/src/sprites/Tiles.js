import React from 'react'
import { makeSprites } from './Hexes'

const pieces = [0, 1, 2, 3, 4, 5, 6, 'pass', 'fail', 'unknown']

export default function Tiles() {
  makeSprites()
  const players = ['player_1', 'player_2']
  const themes = ['', 'theme-carbon']
  return (
    <div>
      {themes.map((theme) => (
        <div key={theme}>
          <h2>{theme || 'No Theme'}</h2>
          <div className={`flex flex-wrap ${theme}`}>
            {pieces.map((name) => (
              <div key={name}>
                {players.map((player) => (
                  <div className="relative dummy_piece" key={player}>
                    <div className={`piece hex hex-${player} type type-${name}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
