<script setup lang="ts">
import { ref } from 'vue';
import { Deck, tryFor } from './medici';

const deck = ref(new Deck());
let result = '';
</script>

<template>
  <button type="button" @click="result = tryFor(deck)">Сложиить</button>
  <div>Колода:<br />{{ deck.printCards() }}</div>
  <div>Осталось:<br />{{ deck.printOpenCards() }}</div>
  <div>{{ result }}</div>
</template>
