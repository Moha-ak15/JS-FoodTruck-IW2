//Models
import { chargerMenu, getMenu } from './models/menu.model.js'
import { getPanier, totalPanier, } from './models/panier.model.js'
import { ajouterCommande } from './models/commande.model.js'

//Views
import { afficherToaster } from './views/toaster.view.js'
import { afficherMenu } from './views/menu.view.js'
import { afficherPanier } from './views/panier.view.js'
import {
  afficherRecapitulatif,
  afficherSuiviCommande,
  afficherEtapeSuivanteCommande,
  afficherCommandes,
} from './views/commande.view.js'


export async function initialiserApp() {
  try {
    await chargerMenu()
    const menu = getMenu()
    if (menu) {
      afficherMenu(menu)
      afficherPanier()
    } else {
      console.error('Le menu est vide ou introuvable.')
    }
  } catch (e) {
    console.error('Erreur lors du chargement du menu :', e)
  }
}


document.addEventListener('DOMContentLoaded', () => {
  initialiserApp()
  afficherCommandes()

  const btnCommander = document.getElementById('btn-commander')
  if (btnCommander) {
    btnCommander.addEventListener('click', () => {
      afficherRecapitulatif()
    })
  }

  const btnValider = document.getElementById('btn-valider')
  if (btnValider) {
    btnValider.addEventListener('click', async () => {
      await 
      afficherSuiviCommande()
      afficherEtapeSuivanteCommande()
      afficherCommandes()
    })
  }
})

const btnValider = document.getElementById('btn-valider')
if (btnValider) {
  btnValider.addEventListener('click', async () => {
    try {
      await afficherSuiviCommande()
      afficherEtapeSuivanteCommande()
      afficherCommandes()
    } catch (error) {
      afficherToaster(error.message, 'danger')
    }
  })
}

