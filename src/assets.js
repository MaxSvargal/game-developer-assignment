let fetchJson = async (url) => {
  let res = await fetch(url)
  let json = await res.json()
  return json
}

export let fetchAssets = () =>
  fetchJson('/assets/assets.json')

export let getSymbolsFromAssets = (assets) =>
  assets.symbols.map(({ key, fileName }) => ({
    name: key,
    url: `${assets.symbolsSrc}${fileName}`
  }))