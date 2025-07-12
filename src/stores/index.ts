/* eslint-disable */
import { defineStore } from 'pinia';
import { useMainStore } from './main';

interface State {
};
export const mainStore = useMainStore();
export const store = defineStore('store', {
	state: (): State => ({
		...mainStore.$state,
	})
});
