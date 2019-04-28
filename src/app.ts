import * as PIXI from 'pixi.js'

import LoadScene from './scenes/LoadScene'
import SelectSymbolScene from './scenes/SelectSymbolScene'
import GameProcessScene from './scenes/GameProcessScene'
import GameOverScene from './scenes/GameOverScene'

interface Asset {
  key: string
  fileName: string
}

interface AssetsJson {
  symbolsSrc: string
  symbols: Asset[]
  buttonsSrc: string
  buttons: Asset[]
}

interface GameAppProps {
  assetsUrl: string
  canvas: {
    width: number
    height: number
  },
  pixiAppConfig: {
    antialias: boolean
    transparent: boolean
  }
}

export default class GameApp {
  app: PIXI.Application
  props: GameAppProps
  symbols: string[]

  constructor(props: GameAppProps) {
    this.props = props
    this.app = new PIXI.Application({ ...props.pixiAppConfig, ...props.canvas })

    let loadScene = new LoadScene({ canvas: props.canvas })
    this.app.stage.addChild(loadScene.scene)

    this.loadResources()
      .then(() => {
        loadScene.scene.visible = false
        this.gameRound()
      })
  }
 
  private async loadResources() {
    let res = await fetch(this.props.assetsUrl)
    let assets: AssetsJson = await res.json()

    this.symbols = assets.symbols.map(({ key }) => key)

    let assetsToResources = (path: string, assets: Asset[]) =>
      assets.map(({ key, fileName }) => ({
        name: key,
        url: `${path}${fileName}`
      }))
 
    let symbols = assetsToResources(assets.symbolsSrc, assets.symbols)
    let buttons = assetsToResources(assets.buttonsSrc, assets.buttons)
    let resources = [ ...symbols, ...buttons ]

    return new Promise((resolve, reject) =>
      PIXI.loader
        .add(resources)
        // .on('progress', onProgress)
        .load(resolve)
        .onError.add(reject)
    )
  }

  private async gameRound() {
    let { symbols, props: { canvas } } = this
    let { resources } = PIXI.loader
    let selectSymbolScene = new SelectSymbolScene({ resources, symbols, canvas })
    let gameProcessScene = new GameProcessScene({ resources, symbols, canvas })
    let gameOverScene = new GameOverScene({ resources, symbols, canvas })
 
    this.app.stage.addChild(selectSymbolScene.scene)
    let selectedSymbol = await selectSymbolScene.onSelectSymbol()
    this.app.stage.removeChild(selectSymbolScene.scene)
    this.app.stage.addChild(gameProcessScene.scene)
    await gameProcessScene.animate()
  
    let resultSymbol = gameProcessScene.getResult()
    this.app.stage.addChild(gameOverScene.scene)
    
    gameOverScene.setState(selectedSymbol, resultSymbol)
    await gameOverScene.onReload()

    this.app.stage.removeChild(gameProcessScene.scene)
    this.app.stage.removeChild(gameOverScene.scene)

    this.gameRound()
  }
}