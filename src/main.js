import { init as initPixi, loadSymbols, getSpritesFromResources, getSpritesButtons } from './pixi'
import { fetchAssets, getSymbolsFromAssets } from './assets'
import { renderHomePage } from './dom'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const wildKey = 'wild'

let main = async () => {
  let app = initPixi({ width: screenWidth, height: screenHeight })
  let assets = await fetchAssets()
  let symbols = getSymbolsFromAssets(assets)
  await loadSymbols(
    symbols,
    (loader, resource) => {
      console.log("loading: " + resource.url)
      console.log("progress: " + loader.progress + "%")
    }
  )
  let selectedVal = await renderHomePage(assets)
  let sprites = getSpritesFromResources()
  let buttons = getSpritesButtons(sprites, screenWidth, onChoose)
  buttons.map(button => app.stage.addChild(button))

  function onChoose(name) {
    name === wildKey
    ? victory()
    : name === selectedVal
      ? victory()
      : defeat()
  }

  function victory() {
    alert('win')
  }

  function defeat() {
    alert('def')
  }
}

main()