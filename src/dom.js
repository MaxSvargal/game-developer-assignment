export const renderHomePage = (assets) =>
  new Promise(resolve => {
    let fragment = document.createDocumentFragment()

    // Container
    let controlsContainer = document.createElement('div')
    controlsContainer.setAttribute('id', 'controls')
    let hideControlsContainer = () => (controlsContainer.style.display = 'none')

    // Select
    let select = document.createElement('select')
    assets.symbols.map(({ key }) => {
      let option = document.createElement('option')
      option.text = key.charAt(0).toUpperCase() + key.slice(1)
      option.setAttribute('value', key)
      select.appendChild(option)
    })
    let selectedValue = select.firstChild.value
    select.addEventListener('change', e => (selectedValue = e.target.value))

    // Play Button
    let playBtn = document.createElement('button')
    playBtn.setAttribute('id', 'playBtn')
    playBtn.innerText = 'Play'
    playBtn.addEventListener('click', e => {
      hideControlsContainer()
      resolve(selectedValue)
    })
    
    controlsContainer.appendChild(select)
    controlsContainer.appendChild(playBtn)

    fragment.appendChild(controlsContainer)
    document.body.appendChild(fragment)
  })