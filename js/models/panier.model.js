// panier.model.js
import { getMenu } from './menu.model.js'

let panier = JSON.parse(localStorage.getItem('panier')) || []

export function getPanier() {
  return panier
}

export function ajouterAuPanier(id) {
  const item = getMenu().find(p => p.id === id)
  const existant = panier.find(p => p.id === id)
  if (existant) {
    existant.qte++
  } else {
    panier.push({ ...item, qte: 1 })
  }
  sauvegarder()
}

export function retirerDuPanier(id) {
  panier = panier.filter(p => p.id !== id)
  sauvegarder()
}

export function viderPanier() {
  panier = []
  sauvegarder()
}

export function modifierQuantite(id, variation) {
  const item = panier.find(p => p.id === id)
  if (!item) return
  item.qte += variation
  if (item.qte <= 0) retirerDuPanier(id)
  else sauvegarder()
}

export function totalPanier() {
  return panier.reduce((total, item) => total + item.price * item.qte, 0)
}

function sauvegarder() {
  localStorage.setItem('panier', JSON.stringify(panier))
}
