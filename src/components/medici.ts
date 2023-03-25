export enum Suit {
  Spades,
  Clubs,
  Diamonds,
  Hearts,
};

export enum Rank {
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  Ace,
};

export interface Card {
  suit: Suit;
  rank: Rank;
};

export class Deck {
  size: number;
  cards: Card[];
  openCards: Card[];
  currentIndex: number;
  constructor(size = 36) {
    if (size <= 0 || size > 52 || size % 4 !== 0) throw new Error(
      `Incorrect number of cards when creating a new deck: ${size}.`
    );
    this.size = size;
    this.reset();
  }
  create(): void {
    this.cards = [];
    this.openCards = [];
    this.currentIndex = this.size - 1;
    const suitsTotal = Object.keys(Suit).filter(isNaN).length;
    const ranksTotal = Object.keys(Rank).filter(isNaN).length;
    for (let s = 0; s < suitsTotal; s++) {
      for (let r = ranksTotal - 1; r >= ranksTotal - this.size / 4; r--) {
        this.cards.push({
          suit: Suit[s],
          rank: Rank[r],
        });
      }
    }
  }
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  reset() {
    this.create();
    this.shuffle();
  }
  nextCard() {
    this.openCards.push(this.cards[this.currentIndex]);
    this.currentIndex--;
  }
}
