import listingVue from "./Vues/ListingVue";
import PokemonCapture from "./Models/PokemonCapture";
import Pokemon from "./Models/Pokemon";

export default class App {
    static sectionPrincipale;
	// Map = tableau de clé et de valeur
	static mapPokemonsCaptures = new Map();

    static init() {
        this.sectionPrincipale = document.querySelector("main > section");
        if (!this.sectionPrincipale) {
			// throw permet de gérer les erreurs
            throw new Error("Section principale non récupérée");
        }

		const ul = document.querySelector("main nav ul");
		listingVue.forEach(vue=>{
			const boutonVue = document.createElement("div");
			boutonVue.classList.add("bouton","boutonPokedex","encadrePokemon","boutonVue");
			boutonVue.innerText = vue.nomVue;
			// addEventListener permet via des blocs (ex boutonPokedex de choisir une redirection)
			boutonVue.addEventListener("click", ()=>{
				this.afficherVue(vue.hash);
			});
			// append -> ajoute un ensemble d'objet
			ul.append(boutonVue);
		});

        onhashchange = this.changementHash;

		this.chargerPokemonsCaptures();

		// .hash : contenant le caractère '#' suivi du chemin URL
        if (document.location.hash.length > 0) {
            this.changementHash();
        }
    }

	static afficherVue(hash) {
		// .location :  permet de connaitre les éléments de l'URL du document dans la fenêtre courante
		document.location.hash = hash;
	}

	// URL chemin si un nb pokemons n'existe pas alors page inconnue
    static changementHash() {
        const hashURL = document.location.hash.substring(1);
		// Split = séparateur de chaine de caractère
		const split = hashURL.split("%");
		const hash = split[0];
		const numeroPokemon = split[1] ? Number(split[1]) : null;

		for (let i = 0; i < listingVue.length; i++) {
			const vue = listingVue[i];
			if (hash === vue.hash) {
				vue.afficher(numeroPokemon);
				return;
			}
		}
    }

	// localStorage garde en mémoire la data sur la PC
	static sauvegarderPokemonsCaptures() {
		const tableauPokemonsCaptures = Array.from(App.mapPokemonsCaptures.values());
		localStorage.setItem("pokemonsCaptures", JSON.stringify(tableauPokemonsCaptures));
	}

	// localStorage garde en mémoire la data sur la PC
	static chargerPokemonsCaptures() {
		const json = localStorage.getItem("pokemonsCaptures");
		if (!json) {
			return;
		}
		let tableauObjets = null;
		try {
			// JSON.parse = analyse une chaîne de caractères JSON et construit la valeur JavaScript
			tableauObjets = JSON.parse(json);
		} catch(e) {
			console.error("Erreur conversion json > PokemonsCaptures");
			return;
		}

		let idCaptureLaPlusElevee = 1;
		tableauObjets.forEach(objet=>{
			const pokemon = new Pokemon(objet.jsonPokemon, objet.jsonEspece);
			const pokemonCapture = new PokemonCapture(objet.nom, pokemon);
			pokemonCapture.idCapture = objet.idCapture;
			pokemonCapture.niveau = objet.niveau;
			pokemonCapture.dateCapture = new Date(objet.dateCapture);
			App.mapPokemonsCaptures.set(pokemonCapture.idCapture, pokemonCapture);
			if (pokemonCapture.idCapture > idCaptureLaPlusElevee) {
				idCaptureLaPlusElevee = pokemonCapture.idCapture;
			}
		});
		PokemonCapture.idCapture = idCaptureLaPlusElevee + 1;
	}
}
window.App = App;