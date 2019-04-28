import { Sprite, Container, Graphics } from 'pixi.js'

const buttonWidth = 255
const buttonHeight = 155
const numOfLists = 10

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length
  let temporaryValue: T
  let randomIndex: number
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

export interface GameProcessSceneProps {
  resources: PIXI.loaders.ResourceDictionary
  symbols: string[]
  canvas: {
    width: number
    height: number
  }
}

export default class GameProcessScene {
  scene = new Container()
  symbols: string[]
  symbolsSprites: { key: string, val: PIXI.Sprite }[]
  canvas: {
    width: number
    height: number
  }
  resources: PIXI.loaders.ResourceDictionary
  rectangle: Graphics
  container: Container

  constructor({ resources, symbols, canvas }: GameProcessSceneProps) {
    this.canvas = canvas
    this.symbols = symbols
    this.resources = resources
    this.render()
  }

  makeSymbolsList() {
    let symbolsList: string[] = [ ...new Array(numOfLists) ]
      .reduce(a => [ ...a, ...this.symbols ], [])
    return shuffle(symbolsList)
  }

  render() {
    this.container = new Container()
    let spriteRatio = buttonWidth / buttonHeight
    let spriteWidth = this.canvas.width / 2
    let spriteHeight = spriteWidth / spriteRatio

    let symbols = this.makeSymbolsList()

    this.symbolsSprites = symbols
      .map(key => [ key, new Sprite(this.resources[key].texture) ] as [ string, Sprite ])
      .reduce((obj, [ key, val ]) => [ ...obj, { key, val } ], [])
  
    this.symbolsSprites.forEach(({ key, val }, index) => {
      val.width = spriteWidth
      val.height = spriteHeight
      val.position.set((this.canvas.width - spriteWidth) / 2, spriteHeight * index)
      val.interactive = true
      val.buttonMode = true
      val.name = key
      this.container.addChild(val)
    })

    this.scene.addChild(this.container)
    this.scene.addChild(this.makeRect())
  }

  makeRect() {
    let container = new Container()
    container.x = 0
    container.y = 0
    container.width = this.canvas.width
    container.height = this.canvas.height

    let rectangle1 = new Graphics()
    rectangle1.beginFill(0xFFFFFF)
    rectangle1.drawRect(0, 0, this.canvas.width / 3, 4)
    rectangle1.endFill()
    rectangle1.x = this.canvas.width / 1.5
    rectangle1.y = this.canvas.height / 2
 
    let rectangle2 = new Graphics()
    rectangle2.beginFill(0xFFFFFF)
    rectangle2.drawRect(0, 0, this.canvas.width / 3, 4)
    rectangle2.endFill()
    rectangle2.x = 0
    rectangle2.y = this.canvas.height / 2

    container.addChild(rectangle1)
    container.addChild(rectangle2)

    return container
  }

  animate() {
    return new Promise(resolve => {
      let { container } = this
   
      let containerHeight = container.height
      let duration = 3000
      let startPosition = 0
      let endPosition = containerHeight - this.canvas.height - buttonHeight
      let startTime: number

      function easeInOutQuad(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
        if ((elapsed /= duration / 2) < 1) {
          return amountOfChange / 2 * elapsed * elapsed + initialValue
        }
        return -amountOfChange / 2 * (--elapsed * (elapsed - 2) - 1) + initialValue
      }

      function loop() {
        if (!startTime) startTime = Date.now()
        const elapsed = Date.now() - startTime
        container.y = -easeInOutQuad(elapsed, startPosition, endPosition, duration)

        elapsed < duration
          ? requestAnimationFrame(loop)
          : resolve()
      }
      requestAnimationFrame(loop)
    })
  }

  getResult() {
    let spriteRatio = buttonWidth / buttonHeight
    let spriteWidth = this.canvas.width / 2
    let spriteHeight = spriteWidth / spriteRatio
    let spritesPerScreen = Math.floor(this.canvas.height / spriteHeight)
    let centerSprite = Math.ceil(spritesPerScreen / 2) + 1

    let result = this.symbolsSprites[this.symbolsSprites.length - centerSprite]
    return result.key
  }
}