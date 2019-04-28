import './index.scss'

import Game from './app'

let game = new Game({
  assetsUrl: '/assets/assets.json',
  canvas: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  pixiAppConfig: {
    antialias: true,
    transparent: true
  }
})

document.body.appendChild(game.app.view)