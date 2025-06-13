import {
  getPanier,
  retirerDuPanier,
  modifierQuantite,
  totalPanier
} from '../models/panier.model.js'


export function afficherPanier() {
  const liste = document.getElementById('panier')
  const total = document.getElementById('total')
  const btnCommander = document.getElementById('btn-commander')

  const panier = getPanier()
  liste.innerHTML = ''

  if (panier.length === 0) {
    btnCommander.disabled = true
    total.innerText = '0 €'
    return
  }

  btnCommander.disabled = false
  panier.forEach(item => {
    const li = document.createElement('li')
    li.className = 'list-group-item d-flex justify-content-between align-items-center'
    li.innerHTML = `
      <div>
        ${item.name} x ${item.qte}
        <button class="btn btn-sm btn-secondary ms-2" data-action="moins" data-id="${item.id}">-</button>
        <button class="btn btn-sm btn-secondary ms-1" data-action="plus" data-id="${item.id}">+</button>
      </div>
      <div>
        <span class="text-muted me-3">${(item.price * item.qte).toFixed(2)} €</span>
        <button class="btn btn-sm btn-danger" data-action="supprimer" data-id="${item.id}">❌</button>
      </div>
    `
    liste.appendChild(li)
  })

  total.innerText = `${totalPanier().toFixed(2)} €`

  document.querySelectorAll('button[data-action]').forEach(btn => {
    const id = parseInt(btn.dataset.id)
    const action = btn.dataset.action

    btn.addEventListener('click', () => {
      if (action === 'supprimer') {
        retirerDuPanier(id)
      } else if (action === 'moins') {
        modifierQuantite(id, -1)
      } else if (action === 'plus') {
        modifierQuantite(id, 1)
      }
      afficherPanier()
    })
  })
}