<script setup lang="ts">
import { ref } from 'vue';
import { Deck } from './medici.ts';

const deck: Deck = new Deck();
</script>

<template>
  <pre>{{ deck }}</pre>
</template>
