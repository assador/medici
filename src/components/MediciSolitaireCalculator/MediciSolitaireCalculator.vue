<script setup lang="ts">
import { ref } from 'vue';
import { Suit, Rank, Card, Deck, tryFor } from './MediciSolitaireCalculator';

const deck = ref(new Deck());
const auxiliaryDeck = ref(new Deck());
let staticCard = ref();
let result: number | null = 0;
</script>

<template>
  <div class="msc">
    <div class="msc-header">
      <button type="button" @click="result = tryFor(deck)">Сложить</button>
    </div>
    <div class="msc-service">
      <h3>Предопределение карт</h3>
      <div class="msc-deck msc-deck-auxiliary">
        <span
          v-for="suit in Object.keys(Suit)"
          class="msc-shift"
        >
          <button
            v-for="card in auxiliaryDeck.cards.filter(card => card.suit === suit)"
            :class="'msc-card ' + (card.suit === 'Diamonds' || card.suit === 'Hearts' ? 'msc-card__red' : 'msc-card__black')"
            @click="staticCard = card"
          >
            <span>{{ Rank[card.rank as keyof typeof Rank] }}</span>
            <span>{{ Suit[card.suit as keyof typeof Suit] }}</span>
          </button>
        </span>
      </div>
      <h3 v-if="deck.staticCards.length">Назначенные карты</h3>
      <div v-if="deck.staticCards.length" class="msc-deck">
        <span class="msc-shift">
          <button
            v-for="card in deck.staticCards"
            :class="'msc-card ' + (card.card.suit === 'Diamonds' || card.card.suit === 'Hearts' ? 'msc-card__red' : 'msc-card__black')"
            @click="deck.unsetStaticCard(card.index)"
          >
            <span>{{ Rank[card.card.rank as keyof typeof Rank] }}</span>
            <span>{{ Suit[card.card.suit as keyof typeof Suit] }}</span>
            <span class="msc-card-ext">№&#160;{{ deck.cards.length - card.index }}</span>
          </button>
        </span>
      </div>
    </div>
    <div class="msc-basic">
      <h3 v-if="!deck.played">Здесь будет складывающаяся колода</h3>
      <h3 v-else>Складывающаяся колода (на&#160;{{ result }}&#160;попытке)</h3>
      <div class="msc-deck">
        <span
          v-for="shift in deck.cardsByShifts()"
          class="msc-shift"
        >
          <button
            v-for="card in shift"
            :class="'msc-card ' + (card.suit === 'Diamonds' || card.suit === 'Hearts' ? 'msc-card__red' : 'msc-card__black')"
            @click="(e) => {if (Object.keys(staticCard).length) {deck.setStaticCard(deck.cards.indexOf(card), staticCard)}}"
          >
            <span>{{ Rank[card.rank as keyof typeof Rank] }}</span>
            <span>{{ Suit[card.suit as keyof typeof Suit] }}</span>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './MediciSolitaireCalculator.scss';
</style>
