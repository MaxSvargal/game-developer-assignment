import { Text, TextStyle, Container } from 'pixi.js'

const textStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 56,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 48,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 16,
  fill: '#fff'
})

export default class LoadScene {
  scene = new Container()

  constructor(props: { canvas: { width: number, height: number } }) {
    let text = new Text('Loading...', textStyle)
    text.x = props.canvas.width / 2 - (text.width / 2)
    text.y = props.canvas.height / 2 - (text.height / 2)
    this.scene.addChild(text)
  }
}