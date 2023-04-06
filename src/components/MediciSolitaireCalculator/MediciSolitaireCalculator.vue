<script setup lang="ts">
import { ref } from 'vue';
import {
  Suit,
  Rank,
  Card,
  Deck,
  DeckList,
  tryFor,
} from './MediciSolitaireCalculator';

const deck = ref(new Deck());
const auxiliaryDeck = ref(new Deck());
const deckList = ref(new DeckList());
const reservedCard = ref<Card | null>(null);
const result = ref<number | null>(0);
// Elements refs
const inputImportFromFile = ref();
const hintBasicCards = ref();
const hintReserveCards = ref();
const hintReservedCards = ref();
const hintSavedDecks = ref();

const cardNumber = (
  indeck: Deck,
  shiftIndex: number,
  cardIndex: number
): number => {
  let index = 0;
  for (let shiftIdx = 0; shiftIdx < shiftIndex; shiftIdx++) {
    index += indeck.cardsByShifts()[shiftIdx].length;
  }
  index += cardIndex;
  return index;
};
const exportToFile = (): void => {
  const mime = 'application/json';
  const a = document.createElement('a');
  a.download = 'msc_exported.json';
  a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
  a.href = URL.createObjectURL(
    new Blob(
      [JSON.stringify({
        deck: deck.value,
        deckList: deckList.value,
      })],
      {type: 'text/plain'}
    )
  );
  a.click();
};
const importFromFile = (): void => {
  const mime =
    (inputImportFromFile.value as HTMLInputElement).files![0].type
  ;
  if (mime !== 'application/json') return;
  const reader = new FileReader();
  reader.onload = (event: Event) => {
    const importedObject = JSON.parse(
      (event.target as FileReader).result as string
    );
    deck.value.import(importedObject.deck);
    deckList.value.import(importedObject.deckList);
    (inputImportFromFile.value as HTMLInputElement).value = '';
  };
  reader.readAsText((inputImportFromFile.value as HTMLInputElement).files![0]);
};
</script>

<template>
  <div class="msc">
    <div class="msc-actions">
      <button type="button" @click="deck.create();">Новая</button>
      <button type="button" @click="result = tryFor(deck);">Сложить</button>
      <button
        v-if="deck.played"
        type="button"
        @click="deckList.add(deck);"
      >
        Добавить в&#160;список
      </button>
      <button type="button" @click="exportToFile();">Сохранить</button>
      <button
        type="button"
        @click="inputImportFromFile.click();"
      >
        Импортировать
      </button>
      <input
          id="inputImportFromFile"
          ref="inputImportFromFile"
          name="jsonFile"
          type="file"
          accept=".json"
          @change="importFromFile();"
      />
    </div>
    <div class="msc-reserve">
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
            :class="'msc-card ' + (
              card.suit === 'Diamonds' || card.suit === 'Hearts'
                ? 'msc-card__red' : 'msc-card__black'
            )"
            @click="reservedCard = card"
          >
            <span>{{ Rank[card.rank as keyof typeof Rank] }}</span>
            <span>{{ Suit[card.suit as keyof typeof Suit] }}</span>
          </button>
        </span>
      </div>
      <h3 v-if="Object.keys(deck.reservedCards).length">
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
      <div
        v-if="Object.keys(deck.reservedCards).length" class="msc-deck">
        <span class="msc-shift">
          <button
            v-for="index in Object.keys(deck.reservedCards).reverse()"
            :class="'msc-card ' + (
              deck.reservedCards[index].suit === 'Diamonds' ||
              deck.reservedCards[index].suit === 'Hearts'
                ? 'msc-card__red' : 'msc-card__black'
            )"
            @click="deck.unsetReservedCard(Number(index))"
          >
            <span>
              {{ Rank[deck.reservedCards[index].rank as keyof typeof Rank] }}
            </span>
            <span>
              {{ Suit[deck.reservedCards[index].suit as keyof typeof Suit] }}
            </span>
            <span class="msc-card-ext">
              №&#160;{{ deck.cards.length - Number(index) }}
            </span>
          </button>
        </span>
      </div>
    </div>
    <div class="msc-basic">
      <h3>
        <span v-if="!deck.played">Рабочая колода</span>
        <span v-else-if="result">
          Складывающаяся колода (попытка&#160;№&#160;{{ result }})
        </span>
        <span v-else>
          Пасьянс не сложился (всего попыток: {{ result }})
        </span>
        <span
          ref="hintBasicCards"
          class="msc-hint"
          @click="hintBasicCards.classList.toggle('msc-hint-shown')"
        >
          Здесь будет выводиться складывающаяся колода. Задайте начальные
          условия; например, предопределённые на&#160;нужных местах карты.
          Затем нажмите на&#160;кнопку «Сложить».
        </span>
      </h3>
      <div class="msc-deck msc-deck-work">
        <span
          v-for="(shift, shiftIndex) in deck.cardsByShifts()"
          class="msc-shift"
        >
          <button
            v-for="(card, cardIndex) in shift"
            :class="
              'msc-card' +
              (card.suit === 'Diamonds' || card.suit === 'Hearts'
                ? ' msc-card__red' : ' msc-card__black'
              ) +
              (deck.cards.indexOf(card) in deck.reservedCards
                ? ' msc-card__reserved' : ''
              )
            "
            @click="
              (e) => {if (reservedCard && Object.keys(reservedCard).length) {
                deck.setReservedCard(deck.cards.indexOf(card), reservedCard)
              }}
            "
          >
            <span>{{ Rank[card.rank as keyof typeof Rank] }}</span>
            <span>{{ Suit[card.suit as keyof typeof Suit] }}</span>
            <span class="msc-card-ext">
              {{ cardNumber(deck, shiftIndex, cardIndex) + 1 }}
            </span>
          </button>
        </span>
      </div>
      <div v-if="deck.played">
        <h3>Свёртки</h3>
        <p class="msc-shifts">
          <span>F({{ deck.shiftIndexes.length }})=</span>
          <span v-for="(shift, index) in deck.shiftIndexes">
            <template v-if="index === 0">
              {{ deck.cards.length - shift }}
            </template>
            <template v-else>
              :{{ deck.shiftIndexes[index - 1] - shift }}
            </template>
          </span>
        </p>
      </div>
    </div>
    <div class="msc-list">
      <h3>
        Список сохранённых колод
        <span v-if="!Object.keys(deckList.decks).length">(пусто)</span>
        <span
          ref="hintSavedDecks"
          class="msc-hint"
          @click="hintSavedDecks.classList.toggle('msc-hint-shown')"
        >
          Здесь будет выводиться список сохранённых вами в&#160;памяти
          сложенных колод. Для&#160;сохранения сложенный колоды нажмите кнопку
          «Сохранить в&#160;списке», которая появляется после расчёта
          сложенной колоды. Активная сложенная «рабочая» колода, показываемая
          в&#160;основной области, в&#160;этом списке выделена фоном.
          Вы&#160;можете выбрать в&#160;этом списке любую сохранённую ранее
          колоду. При&#160;этом она появится также в&#160;блоке «Рабочая колода».
          При&#160;внесении изменений в&#160;эту рабочую колоду, например,
          при&#160;добавлении зарезервированных карт с&#160;последующим новым
          расчётом и&#160;новом клике по&#160;кнопке «Сохранить в&#160;списке»
          новая рассчитанная колода будет сохранена вместо этой выделенной,
          рассчитанной прежде! Если вы хотите сохранить в&#160;списке новый
          расклад, перед ним нажмите на&#160;кнопку «Новая». При&#160;этом,
          в&#160;списке сохранённых колод ни&#160;одна из&#160;них не&#160;будет
          выделена.
        </span>
      </h3>
      <div class="msc-deck-list">
        <button
          v-for="deckInList in deckList.decks"
          :class="
            'msc-deck' +
            (deckInList.id === deck.id ? ' msc-deck__active' : '')
          "
          @click="deck = deckInList"
        >
          <span
            v-for="(shift, shiftIndex) in deckInList.cardsByShifts()"
            class="msc-shift"
          >
            <span
              v-for="(card, cardIndex) in shift"
              :class="
                'msc-card' +
                (card.suit === 'Diamonds' || card.suit === 'Hearts'
                  ? ' msc-card__red' : ' msc-card__black'
                ) +
                (deckInList.cards.indexOf(card) in deckInList.reservedCards
                  ? ' msc-card__reserved' : ''
                )
              "
            >
              <span>{{ Rank[card.rank as keyof typeof Rank] }}</span>
              <span>{{ Suit[card.suit as keyof typeof Suit] }}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './MediciSolitaireCalculator.scss';
</style>
