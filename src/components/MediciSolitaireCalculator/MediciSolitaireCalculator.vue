<script setup lang="ts">
import { ref } from 'vue';
import { Suit, Rank, Deck, tryFor } from './MediciSolitaireCalculator';

const deck = ref(new Deck());
const auxiliaryDeck = ref(new Deck());
let result: number | null = 0;
</script>

<template>
  <div class="msc">
    <div class="msc-service">
      <button type="button" @click="result = tryFor(deck)">Сложить</button>
    </div>
    <div class="msc-basic">
      <h3>Складывающаяся колода (на {{ result }} попытке)</h3>
      <div class="msc-deck">
        <span
          v-for="shift in deck.cardsByShifts()"
          class="msc-shift"
        >
          <span
            v-for="card in shift"
            :class="'msc-card ' + (card.suit === 'Diamonds' || card.suit === 'Hearts' ? 'msc-card__red' : 'msc-card__black')"
          >
            <span>{{ Rank[card.rank as keyof typeof Rank] }}</span>
            <span>{{ Suit[card.suit as keyof typeof Suit] }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './MediciSolitaireCalculator.scss';
</style>
