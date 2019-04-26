require("babel-core/register")
require("babel-polyfill")

import './index.scss'

import 'pixi.js'
import { Sprite } from 'pixi.js';


let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

const screenWidth = window.innerWidth // window.screen.availWidth
const screenHeight = window.innerHeight // window.screen.availHeight
const buttonWidth = 255
const buttonHeight = 155

let app = new PIXI.Application({
  width: screenWidth,
  height: screenHeight,
  antialias: true,
  transparent: true
})

app.renderer.autoResize = true
document.body.appendChild(app.view)

let fetchAssetsConfig = async () => {
  let res = await fetch('/assets/assets.json')
  let json = await res.json()
  return json
}

let main = async () => {
  let assets = await fetchAssetsConfig()
  let path = assets.symbolsSrc
  let symbols = assets.symbols.map(({ key, fileName }) => ({
    name: key,
    url: `${path}${fileName}`
  }))
  console.log({ symbols })

  PIXI.loader
    .add(symbols)
    .on('progress', loadProgressHandler)
    .load(setup)

  function loadProgressHandler(loader, resource) {
    console.log("loading: " + resource.url)
    console.log("progress: " + loader.progress + "%")
  }

  function setup() {
    console.log('complete')

    let fragment = document.createDocumentFragment()
    let controlsContainer = document.createElement('div')
    controlsContainer.setAttribute('id', 'controls')

    let select = document.createElement('select')
    assets.symbols.map(({ key }) => {
      let option = document.createElement('option')
      option.text = key.charAt(0).toUpperCase() + key.slice(1)
      option.setAttribute('value', key)
      select.appendChild(option)
    })

    let playBtn = document.createElement('button')
    playBtn.setAttribute('id', 'playBtn')
    playBtn.innerText = 'Play'
    
    controlsContainer.appendChild(select)
    controlsContainer.appendChild(playBtn)
    fragment.appendChild(controlsContainer)

    document.body.appendChild(fragment)

    let selectedValue = select.firstChild.value
    const wildKey = 'wild'
    select.addEventListener('change', (e) =>
      selectedValue = e.target.value
    )

    playBtn.addEventListener('click', (e) => {
      controlsContainer.style.display = 'none'
      let sprites = Object.values(PIXI.loader.resources).map(({ texture, name }) => {
        let sprite = new Sprite(texture)
        sprite.name = name
        return sprite
      })
      let spritesNum = sprites.length
      let margin = 10
      let spriteRatio = buttonWidth / buttonHeight
      let spriteWidth = screenWidth / spritesNum - (margin * 2)
      let spriteHeight = spriteWidth / spriteRatio

      sprites.forEach((sprite, index) => {
        sprite.width = spriteWidth
        sprite.height = spriteHeight
        // if (index < spritesNum / 2) {
        //   sprite.position.set(screenWidth / 2)
        // }
        // sprite.scale.width = .5 //screenWidth / spritesNum - (margins * 2)
        sprite.position.set(spriteWidth * index + margin, 0)
        sprite.interactive = true
        sprite.buttonMode = true
        sprite.on('pointerdown', (e) => {
            e.target.name === wildKey
              ? victory()
              : e.target.name === selectedValue
                ? victory()
                : defeat()
        })
        
        app.stage.addChild(sprite)
      })
    })

    function victory() {
      alert('win')
    }

    function defeat() {
      alert('def')
    }
  }
}

main()