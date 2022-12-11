import PokemonCapture from "../Models/PokemonCapture";

// Affichage des pokémons (liste)
export default class DivApercuPokemon {
    static creerDiv(pokemon, callbackClick) {
        const divApercu = document.createElement("div");
        divApercu.classList.add("apercuPokemon");

        const img = document.createElement("img");
        img.alt = `Image représentant le pokémon ${pokemon.nomEspece}`;
        img.src = pokemon.srcImage;
        divApercu.append(img);

        const pNomPokemon = document.createElement("p");
        pNomPokemon.classList.add("nomPokemon");
        pNomPokemon.innerText = pokemon instanceof PokemonCapture ? pokemon.nom : pokemon.nomEspece;
        divApercu.append(pNomPokemon);

        const pNumeroPokemon = document.createElement("p");
        pNumeroPokemon.classList.add("numeroPokemon");
        pNumeroPokemon.innerText = pokemon instanceof PokemonCapture ? pokemon.niveau : pokemon.numero;
        divApercu.append(pNumeroPokemon);

        divApercu.addEventListener("click", callbackClick);

        return divApercu;
    }
}