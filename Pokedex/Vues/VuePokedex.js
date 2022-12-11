import DAOPokeAPI from "../DAO/DAOPokeAPI.js";
import App from "../App.js";
import DivApercuPokemon from "../Composants/DivApercuPokemon.js";
import PokemonCapture from "../Models/PokemonCapture";
import Vue from "./Vue";
import {recupererNomPokemon} from "../Utils";

export default class VuePokedex extends Vue {
	static hash = "pokedex";
	static nomVue = "Pokédex";

    static async afficherListe() {
        const loader = document.createElement("div");
        loader.classList.add("loader");
        App.sectionPrincipale.innerHTML = "";
        App.sectionPrincipale.append(loader);

        const map = await DAOPokeAPI.recupererListePokemons();

        const divConteneur = document.createElement("div");
        divConteneur.classList.add("conteneurApercusPokemon");

        // Function de function (anonyme) ou function fléchée
        map.forEach(pokemon=>{
            const divApercu = DivApercuPokemon.creerDiv(pokemon, ()=>{
                this.clickApercuPokemon(pokemon.numero);
            });
            divConteneur.append(divApercu);
        });

        App.sectionPrincipale.innerHTML = "";
        App.sectionPrincipale.append(divConteneur);
    }

    static afficherFiche(numeroPokemon) {
        // Loader chargement page avant affichage
        const loader = document.createElement("div");
        loader.classList.add("loader");
        App.sectionPrincipale.innerHTML = "";
        App.sectionPrincipale.append(loader);

        DAOPokeAPI.recupererPokemon(numeroPokemon).then(pokemon=>{
            if (!pokemon) {
                App.sectionPrincipale.innerHTML = "<p>Pokémon non trouvé</p>";
                return;
            }

            App.sectionPrincipale.innerHTML = `
        <div class="fichePokemon">
            <div class="ficheStatsPokemon">
                <div class="blocHaut">
                    <div class="blocImage">
                        <img title="Image ${pokemon.nomEspece}" alt="Image représentant le pokémon ${pokemon.nomEspece}" src="${pokemon.srcImage}">
                        <p>No.<span>${pokemon.numero}</span></p>
                    </div>
                    <div class="blocNom bordureFlechee">
                        <p>${pokemon.nomEspece.toUpperCase()}</p>
                        <div class="vie">
                            <p>:L<span></span></p>
                            <div>
                                <span>HP:</span>
                                <progress max="100" value="100" class="barreDeVie"></progress>
                            </div>
                            <p>
                                <span>${pokemon.vie}</span>
                                <span>/</span>
                                <span>${pokemon.vie}</span>
                            </p>
                        </div>
                        <p>STATUS/OK</p>
                    </div>
                </div>
                <div class="blocBas">
                    <div class="blocBasStats encadrePokemon">
                        <p>ATTACK</p>
                        <span>${pokemon.attaque}</span>
                        <p>DEFENSE</p>
                        <span>${pokemon.defense}</span>
                        <p>SPEED</p>
                        <span>${pokemon.vitesse}</span>
                        <p>SPECIAL</p>
                        <span>${pokemon.special}</span>
                    </div>
                    <div class="blocBasInfosType bordureFlechee">
                        <p>TYPE<span>1</span>/</p>
                        <span>${pokemon.type1.toUpperCase()}</span>
                        <p>TYPE<span>2</span>/</p>
                        <span>${pokemon.type2.toUpperCase()}</span>
                        <p>ID<span>N<span class="o">o</span></span>/</p>
                        <span class="numId">38710</span>
                        <p>OT/</p>
                        <span class="ot"></span>
                    </div>
                </div>
            </div>
            <div class="ficheInfosPokemon">
                <div class="blocHaut">
                    <div>
                        <img alt="Image représentant le pokémon ${pokemon.nomEspece}" src="${pokemon.srcImage}">
                        <p>No.<span>${pokemon.numero}</span></p>
                    </div>
                    <div>
                        <p>${pokemon.nomEspece.toUpperCase()}</p>
                        <p>${pokemon.genre.toUpperCase()}</p>
                        <div class="hauteurPoids">
                            <span>HT</span>
                            <span>${pokemon.taille}</span>
                        </div>
                        <div class="hauteurPoids">
                            <span>WT</span>
                            <span>${pokemon.poids}lb</span>
                        </div>
                    </div>
                </div>
                <div class="separateur">
                    <div class="carre carreGauche carre1"></div>
                    <div class="carre carreGauche carre2"></div>
                    <div class="carre carreGauche carre3"></div>
                    <div class="carre carreGauche carre4"></div>
                    <div class="carre carreDroite carre1"></div>
                    <div class="carre carreDroite carre2"></div>
                    <div class="carre carreDroite carre3"></div>
                    <div class="carre carreDroite carre4"></div>
                </div>
                <div class="blocBas">${pokemon.description}</div>
            </div>
            <div class="bouton boutonAjouter">Ajouter à mes Pokémons</div>
        </div>
    `;

    const boutonAjouter = App.sectionPrincipale.querySelector(".boutonAjouter");
            // Action click ajout Pokémon dans mes Pokémons
			App.sectionPrincipale.querySelector(".boutonAjouter")?.addEventListener("click", ()=>{
				this.ajouterPokemonAMesPokemons(pokemon);
			});

			if (!pokemon.sourceChaineEvolution) {
				boutonAjouter.classList.add("desactiver");
			}

        });
    }

	static ajouterPokemonAMesPokemons(pokemon) {
		if (!pokemon.sourceChaineEvolution) {
			return;
		}
		const nom = recupererNomPokemon();
		if (nom === null) {
			return;
		}

		const pokemonCapture = new PokemonCapture(nom, pokemon);
		App.mapPokemonsCaptures.set(pokemonCapture.idCapture, pokemonCapture);
		App.sauvegarderPokemonsCaptures();
	}

    static clickApercuPokemon(numeroPokemon) {
        document.location.hash = `${this.hash}%${numeroPokemon}`;
    }
}