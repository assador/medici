import _ from 'lodash';
import { Suit, Rank, Card } from './types';

const generateRandomString = (length = 32): string => {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numChars: number = chars.length;
	let string = '';
	for (let i = 0; i < length; i++) {
		string += chars.substr(Math.floor(Math.random() * numChars), 1);
	}
	return string;
};

export class Deck {
	id: string = generateRandomString();
	currentIndex: number = -1;
	cards: Card[] = [];
	openCards: Card[] = [];
	shiftIndexes: number[] = [];
	reservedCards: {[index: number | string]: Card} = {};
	played: boolean = false;
	constructor(size: number | null = 36) {
		this.create(size);
	}
	create(size: number | null = 36): void {
		if (size !== null && (size <= 0 || size > 52 || size % 4 !== 0)) {
			throw new Error(
				`Incorrect number of cards when creating a new deck: ${size}.`
			);
		}
		this.id = generateRandomString();
		this.currentIndex = size === null ? -1 : size - 1;
		this.cards = [];
		this.openCards = [];
		this.shiftIndexes = [];
		this.reservedCards = {};
		this.played = false;
		if (size === null) return;
		for (let suit of Object.values(Suit)) {
			for (let rank of Object.values(Rank).slice(
				Object.keys(Rank).length - size / Object.keys(Suit).length
			)) {
				this.cards.push({suit, rank});
			}
		}
	}
	static fromJSON(data: any): Deck {
		const deck = new Deck(null);
		deck.id = data.id;
		deck.currentIndex = data.currentIndex;
		deck.cards = data.cards || [];
		deck.openCards = data.openCards || [];
		deck.shiftIndexes = data.shiftIndexes || [];
		deck.played = data.played;
		deck.reservedCards = {};
		if (data.reservedCards) {
			for (const key in data.reservedCards) {
				deck.reservedCards[key] = data.reservedCards[key];
			}
		}
		return deck;
	}
	shuffle(): void {
		let j: number;
		for (let i = this.cards.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			if (i in this.reservedCards || j in this.reservedCards) continue;
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
		this.played = false;
	}
	nextCard(): void {
		if (this.currentIndex < 0) return;
		this.openCards.push(this.cards[this.currentIndex]);
		this.currentIndex--;
	}
	shiftCards(cards: Card[]): boolean {
		let shifted = false;
		let i = 2;
		while (i < cards.length) {
			if (
				cards[i].suit === cards[i - 2].suit ||
				cards[i].rank === cards[i - 2].rank
			) {
				cards.splice(i - 2, 1);
				shifted = true;
				i = Math.max(i - 2, 2);
			} else {
				i++;
			}
		}
		return shifted;
	}
	play(): void {
		for (let i = this.cards.length - 1; i >= 0; i--) {
			this.nextCard();
			this.shiftCards(this.openCards) && this.shiftIndexes.push(i);
		}
		this.played = true;
	}
	setReservedCard(index: number, card: Card): void {
		// Проверка существования задаваемого индекса в рабочей колоде
		if (!this.cards[index]) return;
		// Нахождение индекса задаваемой карты в рабочей колоде
		const cardIndex = this.cards.findIndex(
			c => c.suit === card.suit && c.rank === card.rank
		);
		if (cardIndex === -1) return;
		for (let i in this.reservedCards) {
			if (
				this.reservedCards[i].suit === card.suit &&
				this.reservedCards[i].rank === card.rank
			) {
				delete this.reservedCards[i];
				break;
			}
		}
		this.reservedCards[index] = this.cards[cardIndex];
		[
			this.cards[cardIndex],
			this.cards[index]
		] = [
			this.cards[index],
			this.cards[cardIndex]
		];
		this.shiftIndexes = [];
		this.played = false;
	}
	unsetReservedCard(index: number): void {
		delete this.reservedCards[index];
	}
	cardsByShifts(): Card[][] {
		let shifts: Card[][] = [];
		if (this.shiftIndexes.length === 0)
			return shifts = [this.cards.slice().reverse()]
		;
		for (let i = 0; i < this.shiftIndexes.length; i++) {
			shifts.push(this.cards.slice(
				this.shiftIndexes[i],
				i === 0 ? undefined : this.shiftIndexes[i - 1]
			).reverse());
		}
		return shifts;
	}
	import(deck: any): boolean {
		if (typeof deck === 'string') deck = JSON.parse(deck);
		if (
			!deck.cards ||
			!Array.isArray(deck.cards) ||
			deck.cards.length > 52 || deck.cards.length % 4 !== 0 ||
			deck.cards.find((card: any) => !isCard(card))
		) {
			return false;
		}
		this.cards = deck.cards;
		if (deck.id && typeof deck.id === 'string') this.id = deck.id;
		this.currentIndex = deck.cards.length - 1;
		this.openCards = [];
		this.shiftIndexes = (
			deck.shiftIndexes &&
			Array.isArray(deck.shiftIndexes) &&
			!deck.shiftIndexes.find((index: any) => typeof index !== 'number')
		) ? deck.shiftIndexes : [];
		if (deck.reservedCards && typeof deck.reservedCards === 'object') {
			this.reservedCards = {};
			for (let card of Object.values(deck.reservedCards)) {
				if (!isCard(card)) continue;
				const cardIndex = this.cards.findIndex((c) =>
					c.suit === (card as Card).suit && c.rank === (card as Card).rank
				);
				if (cardIndex === -1) continue;
				this.reservedCards[cardIndex] = this.cards[cardIndex];
			}
		}
		this.played = false;
		return true;
	}
}

export class DeckList {
	decks: {[id: string]: Deck} = {};
	add(deck: Deck): void {
		this.decks[deck.id] = _.cloneDeep(deck);
	};
	remove(deck: Deck): void {
		delete this.decks[deck.id];
	};
	static fromJSON(dataList: any): DeckList {
		const deckList = new DeckList();
		for (const data of Object.values(dataList.decks)) {
			const deck = new Deck(null);
			deck.id = (data as Deck).id;
			deck.currentIndex = (data as Deck).currentIndex;
			deck.cards = (data as Deck).cards || [];
			deck.openCards = (data as Deck).openCards || [];
			deck.shiftIndexes = (data as Deck).shiftIndexes || [];
			deck.played = (data as Deck).played;
			deck.reservedCards = {};
			if ((data as Deck).reservedCards) {
				for (const key in (data as Deck).reservedCards) {
					deck.reservedCards[key] = (data as Deck).reservedCards[key];
				}
			}
			deckList.add(deck);
		}
		return deckList;
	}
	import(deckList: any): boolean {
		if (typeof deckList === 'string') deckList = JSON.parse(deckList);
		if (!deckList.decks) return false;
		this.decks = {};
		for (let deck of Object.values(deckList.decks)) {
			if (typeof deck !== 'string' && typeof deck !== 'object') continue;
			const newDeck = new Deck(null);
			if (newDeck.import(deck)) this.decks[newDeck.id] = newDeck;
		}
		return true;
	}
}

export const isCard = (card: any): card is Card => {
	return card.suit in Suit && card.rank in Rank;
}

export const tryFor = (deck: Deck, tries: number = 5000): number | null => {
	for (let i = 1; i <= tries; i++) {
		deck.openCards = [];
		deck.currentIndex = deck.cards.length - 1;
		deck.shiftIndexes = [];
		deck.shuffle();
		deck.play();
		if (deck.openCards.length === 2) return i;
	}
	return null;
}
