import DAOPokeAPI from "../DAO/DAOPokeAPI";
import {genererNombreAleatoire} from "../Utils";

export default class Pokemon {
	jsonPokemon;
	jsonEspece;
	numero = 0;
	srcImage = "";
	nomEspece = "";
	genre = "";
	vie = 0;
	taille = 0;
	poids = 0;
	description = "";
	attaque = "";
	defense = "";
	vitesse = "";
	special = "";
	type1 = "";
	type2 = "";
	sourceChaineEvolution = false;

	// API oblige de faire un contructeur avec jsonPokemon et jsonEspece, 
	// mais de base tout répertorier les propriétés dans le construteur
    constructor(jsonPokemon, jsonEspece) {
		this.jsonPokemon = jsonPokemon;
		this.jsonEspece = jsonEspece;
		this.recupererDonneesDepuisJSON();
    }

	recupererDonneesDepuisJSON() {
		this.numero = this.jsonPokemon.id;
		this.srcImage = this.jsonPokemon.sprites.front_default;
		this.nomEspece = this.jsonPokemon.name[0].toUpperCase() + this.jsonPokemon.name.substring(1);
		this.genre = this.jsonEspece.genera[7].genus;
		this.vie = 100;
		this.taille = this.jsonPokemon.height;
		this.poids = this.jsonPokemon.weight;
		this.description = this.jsonEspece.flavor_text_entries[0].flavor_text;
		this.attaque = this.jsonPokemon.stats[1].base_stat;
		this.defense = this.jsonPokemon.stats[2].base_stat;
		this.vitesse = this.jsonPokemon.stats[5].base_stat;
		this.special = this.jsonPokemon.stats[3].base_stat;
		this.type1 = this.jsonPokemon.types[0].type.name;
		this.type2 = this.jsonPokemon.types[1]?.type.name ?? "";
		this.sourceChaineEvolution = this.jsonEspece.evolves_from_species === null;
	}

	async evoluer() {
		const mapPokemons = await DAOPokeAPI.recupererListePokemons();

		// regex = validation chaine de caractère
		const regex = /^.+\/(\d+)\/$/m;

		const evolutionChain = await DAOPokeAPI.recupererEvolutionChain(this);
		if (!evolutionChain) {
			return;
		}
		let chainAVerifier = evolutionChain.chain;
		let urlEspeceEvolution = null;
		while (chainAVerifier !== null) {

			let chainSuivant = null;
			const evolvesTo = chainAVerifier.evolves_to;
			if (evolvesTo && evolvesTo.length > 0) {
				if (evolvesTo.length > 1) {
					const tableauFiltre = evolvesTo.filter(chain=>{
						const urlEspece = chain.species.url;
						const match = urlEspece.match(regex);
						const id = Number(match[1]);
						return mapPokemons.has(id);
					});
					const nombreAleatoire = genererNombreAleatoire(0, tableauFiltre.length - 1);
					chainSuivant = tableauFiltre[nombreAleatoire];
				} else {
					chainSuivant = evolvesTo[0];
				}
			}

			if (chainSuivant === null) {
				break;
			}

			if (chainAVerifier.species.name.toLowerCase() === this.nomEspece.toLowerCase()) {
				urlEspeceEvolution = chainSuivant.species.url;
				break;
			} else {
				chainAVerifier = chainSuivant;
			}
		}

		if (!urlEspeceEvolution) {
			return;
		}

		const idPokemon = Number(urlEspeceEvolution.match(regex)[1]);
		if (!mapPokemons.has(idPokemon)) {
			return;
		}

		const {jsonPokemon, jsonEspece} = await DAOPokeAPI.recupererJsonPokemonEtJsonEspeceDepuisURLEspece(urlEspeceEvolution);
		this.jsonPokemon = jsonPokemon;
		this.jsonEspece = jsonEspece;
		this.recupererDonneesDepuisJSON();
	}
}
