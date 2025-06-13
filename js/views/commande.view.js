import { getPanier, totalPanier } from '../models/panier.model.js'
import {
  annulerCommande,
  getCommandes,
  ajouterCommande
} from '../models/commande.model.js'
import { afficherToaster } from './toaster.view.js'


export function afficherRecapitulatif() {
  const liste = document.getElementById('liste-recapitulatif')
  const totalHT = document.getElementById('total-ht')
  const totalTVA = document.getElementById('total-tva')
  const totalTTC = document.getElementById('total-ttc')

  const panier = getPanier()
  liste.innerHTML = ''

  const total = totalPanier()

  panier.forEach(item => {
    const ligne = document.createElement('li')
    ligne.className = 'list-group-item d-flex justify-content-between align-items-center'
    ligne.innerHTML = `
      ${item.name} x ${item.qte}
      <span>${(item.price * item.qte).toFixed(2)} €</span>
    `
    liste.appendChild(ligne)
  })

  const tva = total * 0.2
  const ttc = total + tva

  totalHT.innerText = total.toFixed(2)
  totalTVA.innerText = tva.toFixed(2)
  totalTTC.innerText = ttc.toFixed(2)

  document.getElementById('etape-recap').classList.remove('d-none')
  document.getElementById('etape-suivi').classList.add('d-none')
  document.getElementById('etape-final').classList.add('d-none')

  const modal = new bootstrap.Modal(document.getElementById('modalCommande'))
  modal.show()
}


export async function afficherSuiviCommande() {
  const panier = getPanier()
  const total = totalPanier()

  const nouvelleCommande = {
    id: Date.now(),
    contenu: panier,
    total,
    etat: 'Préparation'
  }

  try {
    ajouterCommande(nouvelleCommande)
  } catch (err) {
    afficherToaster(err.message, 'danger')
    return
  }

  // ✅ Vider le panier après la commande
  viderPanier()

  // ✅ Toast confirmation
  afficherToaster('✅ Commande envoyée avec succès !', 'success')

  document.getElementById('etape-recap').classList.add('d-none')
  document.getElementById('etape-suivi').classList.remove('d-none')
  document.getElementById('etape-final').classList.add('d-none')

  const suivi = document.getElementById('etat-commande')
  const barre = document.getElementById('barre-progress')

  suivi.innerText = '🧑‍🍳 Préparation...'
  await progresserBarre(0, 50, 12000)

  suivi.innerText = '🚚 En livraison...'
  await progresserBarre(50, 100, 12000)

  suivi.innerText = '✅ Livré !'

  // ✅ Réinitialiser la barre après un délai
  setTimeout(() => {
    if (barre) {
      barre.style.width = '0%'
      barre.innerText = '0%'
      barre.setAttribute('aria-valuenow', '0')
    }
  }, 3000)

  // Ne pas appeler afficherCommandes ici si la commande ne doit pas réapparaître automatiquement
}

async function progresserBarre(depart, arrivee, duree) {
  const barre = document.getElementById('barre-progress')
  if (!barre) return

  const startTime = performance.now()

  return new Promise(resolve => {
    function step(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duree, 1)
      const valeur = depart + (arrivee - depart) * progress

      barre.style.width = `${valeur}%`
      barre.innerText = `${Math.round(valeur)}%`
      barre.setAttribute('aria-valuenow', `${Math.round(valeur)}`)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        barre.style.width = `${arrivee}%`
        barre.innerText = `${arrivee}%`
        barre.setAttribute('aria-valuenow', `${arrivee}`)
        resolve()
      }
    }

    requestAnimationFrame(step)
  })
}

export function afficherEtapeSuivanteCommande() {
  document.getElementById('etape-suivi').classList.add('d-none')
  document.getElementById('etape-final').classList.remove('d-none')

  const barre = document.getElementById('barre-progress')
  if (barre) {
    barre.style.transition = 'none'
    barre.style.width = '100%'
    barre.innerText = '100%'
    barre.setAttribute('aria-valuenow', '100')
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fakePostCommande() {
  await delay(2000)
}

export function afficherCommandes() {
  const zone = document.getElementById('commandes-actives')
  const commandes = getCommandes()
  zone.innerHTML = ''

  commandes.forEach(c => {
    const bloc = document.createElement('div')
    bloc.className = 'alert alert-light d-flex justify-content-between align-items-center'
    bloc.innerHTML = `
      <div>
        <strong>Commande #${c.id}</strong> – ${c.etat}<br>
        Total : ${c.total.toFixed(2)} €
      </div>
      ${
        c.etat === "Préparation"
          ? `<button class="btn btn-sm btn-danger" data-commande-id="${c.id}" data-action="annuler">Annuler</button>`
          : ''
      }
    `
    zone.appendChild(bloc)
  })


  document.querySelectorAll('button[data-action="annuler"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.commandeId)
      annulerCommande(id)
      afficherCommandes()
      afficherToaster("Commande annulée.", "danger")
    })
  })
}