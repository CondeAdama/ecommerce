// ==== Références DOM ====
const catalogue = document.getElementById("catalogue-produits");
const listePanier = document.getElementById("liste-panier");
const totalPanier = document.getElementById("total-panier");
const compteurPanier = document.getElementById("compteur-panier");
const champRecherche = document.getElementById("recherche");
const boutonsFiltre = document.querySelectorAll(".filtre-btn");

// ==== Panier ====
let panier = JSON.parse(localStorage.getItem("panier")) || [];

function togglePanier() {
    const modalPanier = document.getElementById("panier");
    modalPanier.classList.toggle("cache");
}

function viderPanier() {
    // Vider le panier dans localStorage
    localStorage.removeItem("panier");
  
    // Vider le DOM
    document.getElementById("liste-panier").innerHTML = "";
    document.getElementById("total-panier").textContent = "Votre panier a été vidé avec succès !";
  
    // Mettre à jour le compteur
    majCompteurPanier();

    panier = [];
  }
  

  function majCompteurPanier() {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    document.getElementById("compteur-panier").textContent = panier.length;
  }
  

  

  // ==== Filtres ====
     boutonsFiltre.forEach(btn => {
     btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-categorie");
      champRecherche.value = ""; // Réinitialiser la recherche
      afficherProduits(cat); // Appeler avec la catégorie sélectionnée
    });
  });
  

// ==== Affichage Produits ====
function afficherProduits(filtre = "", recherche = "") {
  if (!Array.isArray(produits)) {
    console.error("Le tableau 'produits' n'est pas chargé.");
    return;
  }

  catalogue.innerHTML = "";
  let resultat = produits;

  if (filtre && filtre !== "tous") {
    resultat = resultat.filter(p => p.categorie.toLowerCase() === filtre.toLowerCase());
  }

  if (recherche) {
    resultat = resultat.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase()));
  }

  // Limiter à 20 produits max si pas de filtre ni de recherche
  if (filtre === "" && recherche === "") {
    resultat = resultat.slice(0, 20);
  }

  if (resultat.length === 0) {
    catalogue.innerHTML = "<p>Aucun produit trouvé.</p>";
    return;
  }

  resultat.forEach(p => {
    const carte = document.createElement("div");
    carte.className = "carte-produit glass";
    carte.innerHTML = `
      <img src="${p.image}" alt="${p.nom}">
      <h3>${p.nom}</h3>
      <p>${p.prix} GNF</p>
      <button onclick="ajouterAuPanier(${p.id})">Ajouter au panier</button>
    `;
    catalogue.appendChild(carte);
  });
}

// ==== Ajouter au panier ====
function ajouterAuPanier(id) {
  const produit = produits.find(p => p.id === id);
  const existe = panier.find(item => item.id === id);
  if (existe) {
    existe.quantite++;
  } else {
    panier.push({ ...produit, quantite: 1 });
  }
  majPanier();
}

// ==== Supprimer du panier ====
function supprimerDuPanier(id) {
  panier = panier.filter(p => p.id !== id);
  majPanier();
}

// ==== Modifier quantité ====
function modifierQuantite(id, operation) {
  const item = panier.find(p => p.id === id);
  if (!item) return;
  if (operation === "+") item.quantite++;
  if (operation === "-" && item.quantite > 1) item.quantite--;
  majPanier();
}

// ==== Mise à jour du panier ====
function majPanier() {
  listePanier.innerHTML = "";
  let total = 0;
  panier.forEach(p => {
    total += p.prix * p.quantite;
    const ligne = document.createElement("li");
    ligne.innerHTML = `
      <span>${p.nom} (${p.quantite})</span>
      <div>
        <button onclick="modifierQuantite(${p.id}, '-')">-</button>
        <button onclick="modifierQuantite(${p.id}, '+')">+</button>
        <button onclick="supprimerDuPanier(${p.id})">Supprimer</button>
      </div>
    `;
    listePanier.appendChild(ligne);
  });
  totalPanier.textContent = "Total : " + total.toFixed(2) + " GNF";
  compteurPanier.textContent = panier.reduce((acc, item) => acc + item.quantite, 0);
  localStorage.setItem("panier", JSON.stringify(panier));
}

// ==== Recherche dynamique ====
if (champRecherche) {
  champRecherche.addEventListener("input", () => {
    const recherche = champRecherche.value;
    afficherProduits("", recherche);
  });
}

// ==== Filtres ====
boutonsFiltre.forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.getAttribute("data-categorie");
    champRecherche.value = ""; // Réinitialiser la recherche
    afficherProduits(cat === "tous" ? "" : cat);
  });
});

// ==== Initialisation ====
document.addEventListener("DOMContentLoaded", () => {
  afficherProduits();
  majPanier();
});
