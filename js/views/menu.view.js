//models
import { ajouterAuPanier, getPanier } from '../models/panier.model.js'
import { getMenu } from '../models/menu.model.js'

//views
import { afficherPanier } from './panier.view.js'


export function afficherMenu() {
  const menu = getMenu()
  const zone = document.getElementById('menu')
  zone.innerHTML = ''

  menu.forEach(plat => {
    const col = document.createElement('div')
    col.className = 'col-md-6'

    col.innerHTML = `
      <div class="card h-100">
        <img src="./img/${plat.image}" class="card-img-top" alt="${plat.name}">
        <div class="card-body">
          <h5 class="card-title">${plat.name}</h5>
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold">${plat.price.toFixed(2)} €</span>
            <button class="btn btn-sm btn-primary" data-id="${plat.id}">Ajouter</button>
          </div>
        </div>
      </div>
    `

    zone.appendChild(col)
  })

  document.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id)
      ajouterAuPanier(id)
      afficherPanier()
    })
  })
}