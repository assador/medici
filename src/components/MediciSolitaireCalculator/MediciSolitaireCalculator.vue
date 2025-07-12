<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMainStore } from '../../stores/main';
import { Suit, Rank, Card } from './types';
import { Deck, DeckList, tryFor } from './MediciSolitaireCalculator';

const mainStore = useMainStore();

const result = ref<number | null>(null);
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
const exportToFile = (mime: string): void => {
	const a = document.createElement('a');
	switch (mime) {
		case 'text/plain':
			let text = 'Складывающаяся колода\n';
			const cardsByShifts = mainStore.deck.cardsByShifts();
			for (let i = 0; i < cardsByShifts.length; i++) {
				text += `\n`;
				for (const shift of cardsByShifts[i]) {
					text += ` ${(shift.rank.length > 1 ? '' : ' ') + shift.rank}${shift.suit} — \n`;
				}
			}
			a.download = 'msc_exported.txt';
			a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
			a.href = URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
			break;
		default:
			a.download = 'msc_exported.json';
			a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
			a.href = URL.createObjectURL(
				new Blob([
					JSON.stringify(mainStore.$state)],
					{type: 'text/plain'},
				)
			);
			break;
	}
	a.click();
};
const importFromFile = (): void => {
	const mime =
		(inputImportFromFile.value as HTMLInputElement).files![0].type
	;
	if (mime !== 'application/json') return;
	const reader = new FileReader();
	reader.onload = (event: Event) => {
		mainStore.replaceState(JSON.parse(
			(event.target as FileReader).result as string
		));
		result.value = 0;
		(inputImportFromFile.value as HTMLInputElement).value = '';
	};
	reader.readAsText((inputImportFromFile.value as HTMLInputElement).files![0]);
};
onMounted(() => {
	if (sessionStorage.getItem('msc-store-state')) {
		mainStore.replaceState(JSON.parse(
			sessionStorage.getItem('msc-store-state') as string
		));
		result.value = 0;
	}
	mainStore.$subscribe((mutation, state) => {
		sessionStorage.setItem('msc-store-state', JSON.stringify(mainStore.$state));
	});
});
</script>

<template>
	<div class="msc">
		<div class="msc-actions">
			<button type="button" @click="mainStore.deck.create();">Новая</button>
			<button type="button" @click="result = tryFor(mainStore.deck);">Сложить</button>
			<button
			v-if="mainStore.deck.played"
				type="button"
				@click="mainStore.deckList.add(mainStore.deck);"
			>
				Сохранить в списке
			</button>
			<button
				v-if="mainStore.deck.played"
				type="button"
				@click="exportToFile('text/plain')
			">
				Сохранить как текст
			</button>
			<button
				v-if="mainStore.deck.played"
				type="button"
				@click="exportToFile('application/json')"
			>
				Сохранить для импорта
			</button>
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
					Выбор карт, которые при расчёте складывающейся колоды будут
					оставаться на указанных вами местах (число под картой).
					Для предопределения карты нажмите сначала на нужную карту
					в  этом блоке, потом на ту карту в блоке рабочей
					колоды, на позиции которой (указывается номером под картой)
					вы хотите видеть выбранную вами.
				</span>
			</h3>
			<div class="msc-deck msc-deck-auxiliary">
				<span
					v-for="suit in Suit"
					class="msc-shift"
				>
					<button
						v-for="card in mainStore.auxiliaryDeck.cards.filter(card => card.suit === suit)"
						:class="'msc-card ' + (
							card.suit === Suit['Diamonds'] || card.suit === Suit['Hearts']
								? 'msc-card__red' : 'msc-card__black'
						)"
						@click="mainStore.reservedCard = card"
					>
						<span>{{ card.rank }}</span>
						<span>{{ card.suit }}</span>
					</button>
				</span>
			</div>
			<h3 v-if="Object.keys(mainStore.deck.reservedCards).length">
				<span>Предопределённые карты</span>
				<span
					ref="hintReservedCards"
					class="msc-hint"
					@click="hintReservedCards.classList.toggle('msc-hint-shown')"
				>
					Предопределённые вами карты, которые при расчёте складывающейся
					колоды будут оставаться на указанных вами местах (число
					под картой). Для того, чтобы убрать предопределение
					какой-либо карты, нажмите на неё в этом блоке.
				</span>
			</h3>
			<div
				v-if="Object.keys(mainStore.deck.reservedCards).length" class="msc-deck">
				<span class="msc-shift">
					<button
						v-for="index in Object.keys(mainStore.deck.reservedCards).reverse()"
						:class="'msc-card ' + (
							mainStore.deck.reservedCards[index].suit === Suit['Diamonds'] ||
							mainStore.deck.reservedCards[index].suit === Suit['Hearts']
								? 'msc-card__red' : 'msc-card__black'
						)"
						@click="mainStore.deck.unsetReservedCard(Number(index))"
					>
						<span>
							{{ mainStore.deck.reservedCards[index].rank }}
						</span>
						<span>
							{{ mainStore.deck.reservedCards[index].suit }}
						</span>
						<span class="msc-card-ext">
							№ {{ mainStore.deck.cards.length - Number(index) }}
						</span>
					</button>
				</span>
			</div>
		</div>
		<div class="msc-basic">
			<h3>
				<span v-if="!mainStore.deck.played">Рабочая колода</span>
				<span v-else-if="result !== null">
					Складывающаяся колода (попытка № {{ result }})
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
					условия; например, предопределённые на нужных местах карты.
					Затем нажмите на кнопку «Сложить».
				</span>
			</h3>
			<div class="msc-deck msc-deck-work">
				<span
					v-for="(shift, shiftIndex) in mainStore.deck.cardsByShifts()"
					class="msc-shift"
				>
					<button
						v-for="(card, cardIndex) in shift"
						:class="
							'msc-card' +
							(card.suit === Suit['Diamonds'] || card.suit === Suit['Hearts']
								? ' msc-card__red' : ' msc-card__black'
							) +
							(mainStore.deck.cards.indexOf(card) in mainStore.deck.reservedCards
								? ' msc-card__reserved' : ''
							)
						"
						@click="
							if (mainStore.reservedCard && Object.keys(mainStore.reservedCard).length) {
								mainStore.deck.setReservedCard(
									mainStore.deck.cards.indexOf(card),
									mainStore.reservedCard
								);
							}
						"
					>
						<span>{{ card.rank }}</span>
						<span>{{ card.suit }}</span>
						<span class="msc-card-ext">
							{{ cardNumber(mainStore.deck, shiftIndex, cardIndex) + 1 }}
						</span>
					</button>
				</span>
			</div>
			<div v-if="mainStore.deck.played">
				<h3>Свёртки</h3>
				<p class="msc-shifts">
					<span>F({{ mainStore.deck.shiftIndexes.length }})=</span>
					<span v-for="(shift, index) in mainStore.deck.shiftIndexes">
						<template v-if="index === 0">
							{{ mainStore.deck.cards.length - shift }}
						</template>
						<template v-else>
							:{{ mainStore.deck.shiftIndexes[index - 1] - shift }}
						</template>
					</span>
				</p>
			</div>
		</div>
		<div class="msc-list">
			<h3>
				Список сохранённых колод
				<span v-if="!Object.keys(mainStore.deckList.decks).length">(пусто)</span>
				<span
					ref="hintSavedDecks"
					class="msc-hint"
					@click="hintSavedDecks.classList.toggle('msc-hint-shown')"
				>
					Здесь будет выводиться список сохранённых вами в памяти
					сложенных колод. Для сохранения сложенный колоды нажмите кнопку
					«Сохранить в списке», которая появляется после расчёта
					сложенной колоды. Активная сложенная «рабочая» колода, показываемая
					в основной области, в этом списке выделена фоном.
					Вы можете выбрать в этом списке любую сохранённую ранее
					колоду. При этом она появится также в блоке «Рабочая колода».
					При внесении изменений в эту рабочую колоду, например,
					при добавлении зарезервированных карт с последующим новым
					расчётом и новом клике по кнопке «Сохранить в списке»
					новая рассчитанная колода будет сохранена вместо этой выделенной,
					рассчитанной прежде! Если вы хотите сохранить в списке новый
					расклад, перед ним нажмите на кнопку «Новая». При этом,
					в списке сохранённых колод ни одна из них не будет
					выделена.
				</span>
			</h3>
			<div class="msc-deck-list">
				<button
					v-for="deckInList in mainStore.deckList.decks"
					:class="
						'msc-deck' +
						(deckInList.id === mainStore.deck.id ? ' msc-deck__active' : '')
					"
					@click="mainStore.deck = deckInList"
				>
					<span
						class="msc-delete"
						@click="
							(e: MouseEvent) => {
								e.stopPropagation();
								mainStore.deckList.remove(deckInList);
							}
						"
					>
						🗑
					</span>
					<span
						v-for="(shift, shiftIndex) in deckInList.cardsByShifts()"
						class="msc-shift"
					>
						<span
							v-for="(card, cardIndex) in shift"
							:class="
								'msc-card' +
								(card.suit === Suit['Diamonds'] ||
								card.suit === Suit['Hearts']
									? ' msc-card__red' : ' msc-card__black'
								) +
								(deckInList.cards.indexOf(card) in deckInList.reservedCards
									? ' msc-card__reserved' : ''
								)
							"
						>
							<span>{{ card.rank }}</span>
							<span>{{ card.suit }}</span>
						</span>
					</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use './MediciSolitaireCalculator.scss';
</style>
