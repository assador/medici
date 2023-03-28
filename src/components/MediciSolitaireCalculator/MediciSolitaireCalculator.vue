<script setup lang="ts">
import { ref } from 'vue';
import { Suit, Rank, Card, Deck, tryFor } from './MediciSolitaireCalculator';

const deck = ref(new Deck());
const auxiliaryDeck = ref(new Deck());
const staticCard = ref();
const hintBasicCards = ref();
const hintReserveCards = ref();
const hintReservedCards = ref();
let result: number | null = 0;

const cardNumber = (
  shiftIndex: number,
  cardIndex: number
): number => {
  let index = 0;
  for (let shiftIdx = 0; shiftIdx < shiftIndex; shiftIdx++) {
    index += deck.value.cardsByShifts()[shiftIdx].length;
  }
  index += cardIndex;
  return index;
}
</script>

<template>
  <div class="msc">
    <div class="msc-header">
      <button type="button" @click="result = tryFor(deck)">Сложить</button>
    </div>
    <div class="msc-service">
      <h3>
        <span>Предопределение карт</span>
        <span
          ref="hintReserveCards"
          class="msc-hint"
          @click="hintReserveCards.classList.toggle('msc-hint-shown')"
        >
          Выбор карт, которые при&#160;расчёте складывающейся колоды будут
          оставаться на&#160;указанных вами местах (число под&#160;картой).
          Для&#160;предопределения карты нажмите сначала на&#160;нужную карту
          в&#160; этом блоке, потом на&#160;ту&#160;карту в&#160;блоке рабочей
          колоды, на&#160;позиции которой (указывается номером под&#160;картой)
          вы&#160;хотите видеть выбранную вами.
        </span>
      </h3>
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
      <h3 v-if="deck.staticCards.length">
        <span>Предопределённые карты</span>
        <span
          ref="hintReservedCards"
          class="msc-hint"
          @click="hintReservedCards.classList.toggle('msc-hint-shown')"
        >
          Предопределённые вами карты, которые при&#160;расчёте складывающейся
          колоды будут оставаться на&#160;указанных вами местах (число
          под&#160;картой). Для&#160;того, чтобы убрать предопределение
          какой-либо карты, нажмите на&#160;неё в&#160;этом&#160;блоке.
        </span>
      </h3>
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
      <h3>
        <span v-if="!deck.played">Рабочая колода</span>
        <span v-else>Складывающаяся колода (попытка&#160;№&#160;{{ result }})</span>
        <span
          ref="hintBasicCards"
          class="msc-hint"
          @click="hintBasicCards.classList.toggle('msc-hint-shown')"
        >
          Здесь будет выводиться складывающаяся колода. Задайте начальные условия; например, предопределённые на&#160;нужных местах карты. Затем нажмите на&#160;кнопку «Сложить».
        </span>
      </h3>
      <div class="msc-deck">
        <span
          v-for="(shift, shiftIndex) in deck.cardsByShifts()"
          class="msc-shift"
        >
          <button
            v-for="(card, cardIndex) in shift"
            :class="'msc-card ' + (card.suit === 'Diamonds' || card.suit === 'Hearts' ? 'msc-card__red' : 'msc-card__black')"
            @click="(e) => {if (Object.keys(staticCard).length) {deck.setStaticCard(deck.cards.indexOf(card), staticCard)}}"
          >
            <span>{{ Rank[card.rank as keyof typeof Rank] }}</span>
            <span>{{ Suit[card.suit as keyof typeof Suit] }}</span>
            <span class="msc-card-ext">{{ cardNumber(shiftIndex, cardIndex) + 1 }}</span>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './MediciSolitaireCalculator.scss';
</style>
