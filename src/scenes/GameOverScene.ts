import { Sprite, Container, Text, TextStyle } from 'pixi.js'

export interface GameOverSceneProps {
  resources: PIXI.loaders.ResourceDictionary
  symbols: string[]
  canvas: {
    width: number
    height: number
  }
}

const baseTextStyle = {
  fontFamily: 'Arial',
  fontSize: 196,
  stroke: '#fff',
  strokeThickness: 4,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 48,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 16,
}

const winTextStyle = new TextStyle({
  ...baseTextStyle,
  fill: 'rgb(57, 211, 11)'
})

const looseTextStyle = new TextStyle({
  ...baseTextStyle,
  fill: 'rgb(211, 11, 11)'
})

export default class GameOverScene {
  scene = new Container()
  state: boolean
  canvas: {
    width: number
    height: number
  }
  reloadBtn: Sprite
  resources: PIXI.loaders.ResourceDictionary

  constructor(props: GameOverSceneProps) {
    this.canvas = props.canvas
    this.scene.x = 0
    this.scene.y = 0
    this.resources = props.resources
  }

  render() {
    let text = this.state
      ? new Text('Win!', winTextStyle)
      : new Text('Loose!', looseTextStyle)
    
    text.x = this.canvas.width / 2 - (text.width / 2)
    text.y = this.canvas.height / 2 - (text.height / 2)
  
    this.scene.addChild(text)
    this.reloadBtn = new Sprite(this.resources['spin'].texture)
    this.reloadBtn.width *= 2
    this.reloadBtn.height *= 2
    this.reloadBtn.x = this.canvas.width / 2 - (this.reloadBtn.width / 2)
    this.reloadBtn.y = this.canvas.height / 2 + 100
    this.reloadBtn.interactive = true
    this.reloadBtn.buttonMode = true
    this.scene.addChild(this.reloadBtn)
  }

  setState(selectedSymbol: string, resultSymbol: string) {
    this.state = selectedSymbol === resultSymbol || resultSymbol === 'wild'
    this.render()
  }

  async onReload() {
    return new Promise(resolve => {
      this.reloadBtn.on('pointerdown', resolve)
    })
  }
}