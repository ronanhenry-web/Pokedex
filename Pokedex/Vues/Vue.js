// Modèle de vue pour chaque page avoir une structuration dans son ensemble
export default class Vue {
	constructor() {
		if (this.constructor.name === Vue.name) {
			throw new Error("Classe Vue abstraite");
		}
	}

	static hash = null;
	static nomVue = null;
	static afficher(numero) {
		if (numero) {
			this.afficherFiche(numero);
		} else {
			this.afficherListe();
		}
	};
	static afficherListe() {
		throw new Error("Méthode afficherListe non implémentée");
	}
	static afficherFiche(numero) {
		throw new Error("Méthode afficherFiche non implémentée");
	}
}