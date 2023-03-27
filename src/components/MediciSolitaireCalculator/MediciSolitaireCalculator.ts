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

export class Deck {
  size: number;
  cards: Card[];
  openCards: Card[];
  currentIndex: number;
  shiftIndexes: number[];
  staticCards: {index: number, card: Card}[];
  played: boolean;
  constructor(size = 36) {
    if (size <= 0 || size > 52 || size % 4 !== 0) throw new Error(
      `Incorrect number of cards when creating a new deck: ${size}.`
    );
    this.size = size;
    this.cards = [];
    this.openCards = [];
    this.currentIndex = this.size - 1;
    this.shiftIndexes = [];
    this.staticCards = [];
    this.played = false;
    this.create();
  }
  create(): void {
    this.cards = [];
    this.openCards = [];
    this.currentIndex = this.size - 1;
    this.shiftIndexes = [];
    this.staticCards = [];
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
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
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
  cardsByShifts(): Card[][] {
    let shifts: Card[][] = [];
    if (this.shiftIndexes.length === 0) return shifts = [this.cards];
    for (let i = 0; i < this.shiftIndexes.length; i++) {
      shifts.push(this.cards.slice(
        this.shiftIndexes[i],
        i === 0 ? undefined : this.shiftIndexes[i - 1]
      ).reverse());
    }
    return shifts;
  }
  printCards(): string {
    return (
      (this.shiftIndexes.length > 0 ? '<' : '') +
      this.cards.map((card, i) => 
        Rank[card.rank as keyof typeof Rank] +
        Suit[card.suit as keyof typeof Suit] +
        (this.shiftIndexes.includes(i) ? ' >' + (i > 0 ? '<' : '') : '')
      ).reverse().join(' ')
    );
  }
  printOpenCards(): string {
    return this.openCards.map(card =>
      Rank[card.rank as keyof typeof Rank] +
      Suit[card.suit as keyof typeof Suit]
    ).join(' ');
  }
}

export const tryFor = (deck: Deck, tries: number = 5000): number | null => {
  for (let i = 1; i <= tries; i++) {
    deck.create();
    deck.shuffle();
    deck.play();
    if (deck.openCards.length === 2) return i;
  }
  return null;
}
