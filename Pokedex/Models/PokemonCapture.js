import Pokemon from "./Pokemon";

export default class PokemonCapture extends Pokemon {
	idCapture = PokemonCapture.idCapture++;
	nom = "";
	dateCapture = new Date();
	niveau = 1;

	static idCapture = 1;

	constructor(nom, pokemon) {
		super(pokemon.jsonPokemon, pokemon.jsonEspece);
		this.nom = nom;
	}
}