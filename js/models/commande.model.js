let commandes = JSON.parse(localStorage.getItem('commandes')) || []

export function getCommandes() {
  return commandes
}

export function ajouterCommande(commande) {
  if (commandes.length >= 5) {
    throw new Error("Trop de commandes en cours.")
  }
  commandes.push(commande)
  localStorage.setItem('commandes', JSON.stringify(commandes))
}


export function annulerCommande(id) {
  commandes = commandes.filter(c => c.id !== id)
  sauvegarder()
}

function sauvegarder() {
  localStorage.setItem('commandes', JSON.stringify(commandes))
}
