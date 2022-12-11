import App from "../App";
import Vue from "./Vue";
import DivApercuPokemon from "../Composants/DivApercuPokemon";
import {genererNombreAleatoire, recupererNomPokemon} from "../Utils";

export default class VueMesPokemons extends Vue {
	static hash = "mesPokemons";
	static nomVue = "Mes Pokémons";

	static afficherListe() {
		if (App.mapPokemonsCaptures.size === 0) {
			App.sectionPrincipale.innerText = "Aucun pokémon capturé";
			return;
		}
		App.sectionPrincipale.innerHTML = "";

		const divConteneur = document.createElement("div");
		divConteneur.classList.add("conteneurApercusPokemon");

		App.mapPokemonsCaptures.forEach(pokemonCapture=>{
			const div = DivApercuPokemon.creerDiv(pokemonCapture, ()=>{
				this.clickDivPokemon(pokemonCapture.idCapture);
			});
			divConteneur.append(div);
		});

		App.sectionPrincipale.append(divConteneur);
	}

	static afficherFiche(idCapture) {
		const pokemon = App.mapPokemonsCaptures.get(idCapture);
		if (!pokemon) {
			throw new Error("Pokémon capturé introuvable");
		}

		App.sectionPrincipale.innerHTML = `
			<div class="fichePokemonCapture">
				<img alt="Image représentant le pokémon" src="${pokemon.srcImage}"/>
				<div class="nomPokemon"></div>
				<div class="dateCapture">Capturé le : ${pokemon.dateCapture.toLocaleDateString()}</div>
				<div class="niveauPokemon">Niveau : ${pokemon.niveau}</div>
			</div>
			<div class="bouton boutonRenommer">Renommer ${pokemon.nom}</div>
			<div class="bouton boutonRelacher">Relâcher ${pokemon.nom}</div>
			<div class="bouton boutonEntrainer">Entraîner ${pokemon.nom}</div>
		`;
		App.sectionPrincipale.querySelector(".nomPokemon").innerText = pokemon.nom;

		App.sectionPrincipale.querySelector(".boutonRenommer")?.addEventListener("click", ()=>{
			this.renommerPokemon(pokemon);
		});
		App.sectionPrincipale.querySelector(".boutonRelacher")?.addEventListener("click", ()=>{
			this.relacherPokemon(pokemon);
		});
		const boutonEntrainer = App.sectionPrincipale.querySelector(".boutonEntrainer");
		boutonEntrainer?.addEventListener("click", ()=>{
			this.entrainerPokemon(pokemon);
		});
		if (pokemon.niveau >= 100) {
			boutonEntrainer.classList.add("desactiver");
		}
	}

	static clickDivPokemon(idCapture) {
		window.location.hash = `${this.hash}%${idCapture}`;
	}

	static renommerPokemon(pokemon) {
		const nouveauNom = recupererNomPokemon();
		if (nouveauNom === null) {
			return;
		}
		pokemon.nom = nouveauNom;
		App.mapPokemonsCaptures.set(pokemon.idCapture, pokemon);
		App.sauvegarderPokemonsCaptures();

		this.afficherFiche(pokemon.idCapture);
	}

	static relacherPokemon(pokemon) {
		const confirmation = confirm(`Relâcher ${pokemon.nom} ?`);
		if (!confirmation) {
			return;
		}
		App.mapPokemonsCaptures.delete(pokemon.idCapture);
		App.sauvegarderPokemonsCaptures();
		document.location.hash = this.hash;
	}

	static async entrainerPokemon(pokemon) {
		if (pokemon.niveau >= 100) {
			return;
		}
		const niveauAvantEntrainement = pokemon.niveau;
		const niveauxGagnes = genererNombreAleatoire(5, 10);
		pokemon.niveau += niveauxGagnes;
		alert(`${pokemon.nom} a gagné ${niveauxGagnes} niveaux !`);
		if (pokemon.niveau > 100) {
			pokemon.niveau = 100;
		}
		if ((niveauAvantEntrainement < 25 && pokemon.niveau >= 25) || (niveauAvantEntrainement < 50 && pokemon.niveau >= 50)) {
			const especeAvant = pokemon.nomEspece;
			await pokemon.evoluer();
			if (especeAvant !== pokemon.nomEspece) {
				alert(`${pokemon.nom} a évolué !`);
			}
		}
		App.sauvegarderPokemonsCaptures();

		this.afficherFiche(pokemon.idCapture);
	}
}