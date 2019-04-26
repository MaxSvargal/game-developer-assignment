import 'pixi.js'
import { Sprite } from 'pixi.js'

export let init = ({ width, height }) => {
  let type = "WebGL"
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
  }

  let app = new PIXI.Application({
    width,
    height,
    antialias: true,
    transparent: true
  })

  app.renderer.autoResize = true
  document.body.appendChild(app.view)
  return app
}

export let loadSymbols = (symbols, onProgress) =>
  new Promise((resolve, reject) =>
    PIXI.loader
      .add(symbols)
      .on('progress', onProgress)
      .load(resolve)
      .onError.add(reject)
  )

export let getSpritesFromResources = () =>
  Object.values(PIXI.loader.resources).map(({ texture, name }) => {
    let sprite = new Sprite(texture)
    sprite.name = name
    return sprite
  })

const buttonWidth = 255
const buttonHeight = 155
const buttonsMargin = 10

export let getSpritesButtons = (sprites, screenWidth, onChoose) => {
  let spritesNum = sprites.length
  let spriteRatio = buttonWidth / buttonHeight
  let spriteWidth = screenWidth / spritesNum - (buttonsMargin * 2)
  let spriteHeight = spriteWidth / spriteRatio

  return sprites.map((sprite, index) => {
    sprite.width = spriteWidth
    sprite.height = spriteHeight
    sprite.position.set(spriteWidth * index + buttonsMargin, 0)
    sprite.interactive = true
    sprite.buttonMode = true

    sprite.on('pointerdown', e => {
      onChoose(e.target.name)
      sprite.off('pointerdown')
    })

    return sprite
  })
}

export default init