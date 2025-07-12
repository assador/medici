import { defineStore } from 'pinia';
import {
	Suit,
	Rank,
	Card,
} from '../components/MediciSolitaireCalculator/types';
import {
	Deck,
	DeckList,
	tryFor,
} from '../components/MediciSolitaireCalculator/MediciSolitaireCalculator';

export interface IMainState {
	deck: Deck;
	auxiliaryDeck: Deck;
	deckList: DeckList;
	reservedCard: Card | null;
}

export const useMainStore = defineStore('main', {
	state: (): IMainState => ({
		deck: new Deck(),
		auxiliaryDeck: new Deck(),
		deckList: new DeckList(),
		reservedCard: null,
	}),
	actions: {
		async replaceState(payload: IMainState) {
			this.deck = Deck.fromJSON(payload.deck);
			this.auxiliaryDeck = Deck.fromJSON(payload.auxiliaryDeck);
			this.deckList = DeckList.fromJSON(payload.deckList);
		},
	},
	getters: {
	},
});
