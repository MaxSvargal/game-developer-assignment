import { Sprite, Container, Text, TextStyle } from 'pixi.js'

const buttonWidth = 255
const buttonHeight = 155
const buttonsMargin = 10
const animationPeriod = 500

const chooseSymbolTextStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 56,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 48,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 16,
  fill: '#fff'
})

export interface SelectSymbolSceneProps {
  resources: PIXI.loaders.ResourceDictionary
  symbols: string[]
  canvas: {
    width: number
    height: number
  }
}

export default class SelectSymbolScene {
  scene = new Container()
  symbolsForChoose: string[]
  symbolsSprites: {
    [key: string]: PIXI.Sprite
  }
  canvas: {
    width: number
    height: number
  }

  constructor({ resources, symbols, canvas }: SelectSymbolSceneProps) {
    this.canvas = canvas
    this.symbolsForChoose = symbols.filter(k => k !== 'wild')
    this.symbolsSprites = this.symbolsForChoose
      .map(k => new Sprite(resources[k].texture))
      .reduce((a, b, i) => ({ ...a, [this.symbolsForChoose[i]]: b }), {})

    this.render()
  }

  render() {
    let container = new Container()
    let spritesNum = Object.keys(this.symbolsSprites).length
    let spriteRatio = buttonWidth / buttonHeight
    let spriteWidth = this.canvas.width / spritesNum - buttonsMargin
    let spriteHeight = spriteWidth / spriteRatio
  
    this.symbolsForChoose.forEach((key, index) => {
      let symbol = this.symbolsSprites[key]
      symbol.width = spriteWidth
      symbol.height = spriteHeight
      symbol.position.set((spriteWidth * index) + (buttonsMargin * index), (this.canvas.height - spriteHeight) / 2)
      symbol.interactive = true
      symbol.buttonMode = true
 
      container.addChild(symbol)
    })

    let text = new Text('Choose your symbol', chooseSymbolTextStyle)
    text.x = this.canvas.width / 2 - (text.width / 2)
    text.y = this.canvas.height / 2 - 150

    this.scene.addChild(text)
    this.scene.addChild(container)
  }

  animateSelectedSymbol(sprite: PIXI.Sprite) {
    let { scene } = this
    let start = 0
    let vx = 0
    let vy = 0
    let vw = 0
    let vh = 0

    function loop(timestamp: number) {
      if (!start) start = timestamp
      let progress = timestamp - start
   
      vx = -50
      vy = -50
      vw = 100
      vh = 100
    
      sprite.x += vx
      sprite.y += vy
      sprite.width += vw
      sprite.height += vh

      scene.alpha -= .05

      progress < animationPeriod && requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  onSelectSymbol() {
    return new Promise<string>(resolve => {
      let removeAllListeners = () =>
        Object.keys(this.symbolsSprites).forEach(key => {
          this.symbolsSprites[key].off('pointerdown')
        })

      Object.keys(this.symbolsSprites).forEach(symbolKey => {
        let selectedSprite = this.symbolsSprites[symbolKey]
        selectedSprite.on('pointerdown', () => {
          // To move sprite behind of others
          this.scene.removeChild(selectedSprite)
          this.scene.addChild(selectedSprite)
          // removeAllListeners()
          this.animateSelectedSymbol(selectedSprite)
          setTimeout(() => resolve(symbolKey), animationPeriod)
        })
      })
    })
  }
}