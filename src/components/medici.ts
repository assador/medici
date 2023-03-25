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
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  reset(): void {
    this.create();
    this.shuffle();
  }
  printCards(): string {
    return this.cards.map(card => Rank[card.rank] + Suit[card.suit]).reverse().join(' ');
  }
  printOpenCards(): string {
    return this.openCards.map(card => Rank[card.rank] + Suit[card.suit]).join(' ');
  }
  nextCard(): void {
    if (this.currentIndex < 0) return;
    this.openCards.push(this.cards[this.currentIndex]);
    this.currentIndex--;
  }
  shiftCards(cards: Card[], index: number) {
    if (cards[index - 2] && (
      cards[index].suit === cards[index - 2].suit ||
      cards[index].rank === cards[index - 2].rank
    )) {
      cards.splice(index - 2, 1);
      index -= 2;
    } else if (cards[index + 1]) {
      index += 1;
    } else return;
    this.shiftCards(this.openCards, index);
  }
  play(): void {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      this.nextCard();
      this.shiftCards(this.openCards, this.openCards.length - 1);
    }
    this.played = true;
  }
}

export const tryFor = (deck: Deck, tries?: number = 5000): void => {
  for (let i = 1; i <= tries; i++) {
    deck.reset();
    deck.play();
    if (deck.openCards.length === 2) return `Всем …! Получилось! Колупался ${i} раз…`;
  }
  return `Ну, я хотя бы попробовал ${tries} раз…`;
}
