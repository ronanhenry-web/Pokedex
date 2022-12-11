// Utilisé par le bouton ajouterPokémon, renamePokémon, relacherPokémon, entrainerPokémon
export function recupererNomPokemon() {
	let nom = "";
	while (!nomEstValideOuNull(nom)) {
		nom = prompt("Nom du Pokémon ?");
		if (nom) {
			nom = nom.trim();
			nom = nom[0].toUpperCase() + nom.substring(1);
		}
	}
	return nom;
}

// Utilisé par le bouton ajouterPokémon, renamePokémon, relacherPokémon, entrainerPokémon
function nomEstValideOuNull(nom) {
	return nom === null || nom.length > 0;
}

// Utilisé par le bouton entrainerPokémon
export function genererNombreAleatoire(min, max) {
	const nombre = Math.random() * (max - min) + min;
	return Math.round(nombre);
}