let menu = []

export async function chargerMenu() {
  const res = await fetch('./data/menu.json')
  menu = (await res.json()).map(item => ({
    ...item,
    price: parseFloat(item.price)
  }))
}

export function getMenu() {
  return menu
}
