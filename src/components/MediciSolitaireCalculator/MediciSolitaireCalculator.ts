import _ from 'lodash';

export enum Suit {
  Spades   = '♠',
  Clubs    = '♣',
  Diamonds = '♦',
  Hearts   = '♥',
};

export enum Rank {
  Two   = '2',
  Three = '3',
  Four  = '4',
  Five  = '5',
  Six   = '6',
  Seven = '7',
  Eight = '8',
  Nine  = '9',
  Ten   = '10',
  Jack  = 'J',
  Queen = 'Q',
  King  = 'K',
  Ace   = 'A',
};

export interface Card {
  suit: string;
  rank: string;
};

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
  size: number;
  currentIndex: number;
  cards: Card[] = [];
  openCards: Card[] = [];
  shiftIndexes: number[] = [];
  reservedCards: {[index: number | string]: Card} = {};
  played: boolean = false;
  constructor(size = 36) {
    if (size <= 0 || size > 52 || size % 4 !== 0) throw new Error(
      `Incorrect number of cards when creating a new deck: ${size}.`
    );
    this.size = size;
    this.currentIndex = this.size - 1;
    this.create(size);
  }
  create(size = 36): void {
    this.id = generateRandomString();
    this.size = size;
    this.currentIndex = this.size - 1;
    this.cards = [];
    this.openCards = [];
    this.shiftIndexes = [];
    this.reservedCards = {};
    this.played = false;
    for (let suit in Suit) {
      for (let rank of Object.keys(Rank).slice(
        Object.keys(Rank).length - this.size / Object.keys(Suit).length
      )) {
        this.cards.push({
          suit: suit,
          rank: rank,
        });
      }
    }
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
  shiftCards(cards: Card[], index: number): boolean {
    let shifted = false;
    if (cards[index - 2] && (
      cards[index].suit === cards[index - 2].suit ||
      cards[index].rank === cards[index - 2].rank
    )) {
      cards.splice(index - 2, 1);
      index -= 2;
      shifted = true;
    } else if (cards[index + 1]) {
      index += 1;
    } else return shifted;
    this.shiftCards(this.openCards, index);
    return shifted;
  }
  play(): void {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      this.nextCard();
      this.shiftCards(this.openCards, this.openCards.length - 1)
        && this.shiftIndexes.push(i)
      ;
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
}

export class DeckList {
  decks: {[id: string]: Deck} = {};
  add(deck: Deck): void {
    this.decks[deck.id] = _.cloneDeep(deck);
  };
}

export const tryFor = (deck: Deck, tries: number = 5000): number | null => {
  for (let i = 1; i <= tries; i++) {
    deck.openCards = [];
    deck.currentIndex = deck.size - 1;
    deck.shiftIndexes = [];
    deck.shuffle();
    deck.play();
    if (deck.openCards.length === 2) return i;
  }
  return null;
}
