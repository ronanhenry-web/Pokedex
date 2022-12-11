import Pokemon from "../Models/Pokemon.js";

export default class DAOPokeAPI {
    static mapPokemons = null;

    static async recupererListePokemons() {
        if (this.mapPokemons === null) {
            //const tableauPokemons = [];
            this.mapPokemons = new Map();

            // Fetch permet de faire une fonction asynchrone, retourne une promise
            const responsePokemons = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
            const jsonPokemons = await responsePokemons.json();

            // Choisir V2 plus simple a comprendre mais il manque le try et catch
            //V4
            let tableauPromises = [];
            jsonPokemons.results.forEach(pokemonListe=>{
                const promise = new Promise((resolve, reject)=>{
                    const promisePokemon = fetch(pokemonListe.url);
                    promisePokemon.then(async responsePokemon=>{
                        const jsonPokemon = await responsePokemon.json();
                        const promiseEspece = fetch(jsonPokemon.species.url);
                        promiseEspece.then(async responseEspece=>{
                            const jsonEspece = await responseEspece.json();
                            const pokemon = new Pokemon(jsonPokemon, jsonEspece);
                            resolve(pokemon);
                        });
                    });
                });
                tableauPromises.push(promise);
            });

            try {
                const tableauPokemons = await Promise.all(tableauPromises);
                tableauPokemons.sort((pokemon1, pokemon2) => {
                    return pokemon1.numero - pokemon2.numero;
                });
                this.mapPokemons = new Map(tableauPokemons.map(pokemon => [pokemon.numero, pokemon]));
                return this.mapPokemons;
            } catch (e) {
                console.error(e);
                return new Map();
            }

            //V3
            /*let tableauPromisesPokemons = [];
            for (let i = 0; i < jsonPokemons.results.length; i++) {
                const pokemonListe = jsonPokemons.results[i];
                const promiseResponsePokemon = fetch(pokemonListe.url);
                tableauPromisesPokemons.push(promiseResponsePokemon);
            }

            const responsesPokemons = await Promise.all(tableauPromisesPokemons);
            let tableauPromisesEspeces = [];
            let tableauPokemons = [];
            for (let i = 0; i < responsesPokemons.length; i++) {
                const response = responsesPokemons[i];
                const jsonPokemon = await response.json();
                const promiseResponseEspece = fetch(jsonPokemon.species.url);
                tableauPromisesEspeces.push(promiseResponseEspece);
                tableauPokemons.push(jsonPokemon);
            }

            const responsesEspeces = await Promise.all(tableauPromisesEspeces);
            for (let i = 0; i < responsesEspeces.length; i++) {
                const response = responsesEspeces[i];
                const jsonEspece = await response.json();
                const jsonPokemon = tableauPokemons[i];
                const pokemon = new Pokemon(jsonPokemon, jsonEspece);
                mapPokemons.set(pokemon.numero, pokemon);
            }*/


            //V2
            /*for (let i = 0; i < jsonPokemons.results.length; i++) {
                const pokemonListe = jsonPokemons.results[i];
                const responsePokemon = await fetch(pokemonListe.url);
                const jsonPokemon = await responsePokemon.json();

                const responseEspece = await fetch(jsonPokemon.species.url);
                const jsonEspece = await responseEspece.json();

                const pokemon = new Pokemon(jsonPokemon, jsonEspece);
                mapPokemons.set(pokemon.numero, pokemon);
            }

            return mapPokemons;*/


            //V1
            /*const promiseResponsePokemons = fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
            promiseResponsePokemons.then(responsePokemons=>{
                const promiseJsonPokemons = responsePokemons.json();
                promiseJsonPokemons.then(jsonPokemons=>{

                    jsonPokemons.results.forEach(pokemonListe=>{
                        const promiseResponsePokemon = fetch(pokemonListe.url);
                        promiseResponsePokemon.then(responsePokemon=>{
                            const promiseJsonPokemon = responsePokemon.json();
                            promiseJsonPokemon.then(jsonPokemon=>{

                                const promiseResponseEspece = fetch(jsonPokemon.species.url);
                                promiseResponseEspece.then(responseEspece=>{
                                    const promiseJsonEspece = responseEspece.json();
                                    promiseJsonEspece.then(jsonEspece=>{
                                        const pokemon = new Pokemon(jsonPokemon, jsonEspece);
                                        tableauPokemons.push(pokemon);
                                        if (tableauPokemons.length === 151) {
                                            tableauPokemons.sort((pokemon1, pokemon2)=>{
                                                return pokemon1.numero - pokemon2.numero;
                                            });
                                            mapPokemons = new Map(tableauPokemons.map(pokemon=>[pokemon.numero, pokemon]));
                                            resolve(mapPokemons);
                                        }
                                    });
                                });

                            });
                        });
                    });

                });
            });*/
        } else {
            return this.mapPokemons;
        }
    }

    static recupererPokemon(numero) {
        return new Promise(resolve=>{
            // .then() promise résolue
            this.recupererListePokemons().then(mapPokemons=>{
                const pokemon = mapPokemons.get(numero);
                resolve(pokemon);
            });
        });
    }

	static async recupererEvolutionChain(pokemon) {
		const url = pokemon.jsonEspece.evolution_chain.url;
		if (!url) {
			return null;
		}
        // Gestion des erreurs
		try {
			const response = await fetch(url);
			const json = await response.json();
			return json;
		} catch(e) {
			return null;
		}
	}

	static async recupererJsonPokemonEtJsonEspeceDepuisURLEspece(urlEspece) {
		try {
			const responseEspece = await fetch(urlEspece);
			const jsonEspece = await responseEspece.json();

			const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${jsonEspece.id}`;
			const responsePokemon = await fetch(urlPokemon);
			const jsonPokemon = await responsePokemon.json();

			return {jsonEspece, jsonPokemon};
		} catch(e) {
			return null;
		}
	}
}