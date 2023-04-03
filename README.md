# Medici Solitaire Calculator

v1.3.2

Свободный скрипт для складывания пасьянса Медичи.

Другие реализации видел, но открытого кода не находил. Тот чувак, что писал виндовый ПМ-калькулятор в начале века, насколько знаю, код не открывал. Решил, что такую штуку имеет смысл писать на TypeScript — замороченных вычислений не будет, так что скорости JS-движков приемлемы, зато дёшево, сердито, просто и популярно. 

Основная библиотека — [MediciSolitaireCalculator.ts](https://github.com/assador/medici/blob/master/src/components/MediciSolitaireCalculator/MediciSolitaireCalculator.ts). Всё остальное — конкретная рабочая реализация на Vue.js, которой можно пренебречь при использовании этой библиотеки где бы то ни было ещё.

## Установка

1. Склонировать репозиторий
2. В склонированном каталоге: `npm install && npm run build`
2. Или просто берёте файл [MediciSolitaireCalculator.ts](https://github.com/assador/medici/blob/master/src/components/MediciSolitaireCalculator/MediciSolitaireCalculator.ts) и делаете с ним всё, что заблагорассудится (в рамках GPLv3)

## Описание работы реализации на Vue.js

Ниже описана работа готовой сборки скрипта на Vue.js. Ею можно пользоваться свободно по адресу: <https://assador.github.io/medici>.

### Блок «Рабочая колода»

В этом блоке будет выводиться складывающаяся колода. Задайте начальные условия; например, предопределённые на нужных местах карты. Затем нажмите на кнопку «Сложить».

### Блок «Предопределение карт»

Выбор карт, которые при расчёте складывающейся колоды будут оставаться на указанных вами местах (число под картой). Для предопределения карты нажмите сначала на нужную карту в этом блоке, потом на ту карту в блоке рабочей колоды, на позиции которой (указывается номером под картой) вы хотите видеть выбранную вами.

Под этим блоком с упорядоченной колодой, ниже, показываются уже предопределённые вами карты. Для того, чтобы убрать предопределение какой-либо карты, нажмите на неё в этом блоке.

### «Список сохранённых колод»

В этом блоке будет выводиться список сохранённых вами в памяти сложенных колод. Для сохранения сложенный колоды нажмите кнопку «Сохранить в списке», которая появляется после расчёта сложенной колоды. Активная сложенная «рабочая» колода, показываемая в основной области, в этом списке выделена фоном. Вы можете выбрать в этом списке любую сохранённую ранее колоду. При этом она появится также в блоке «Рабочая колода». При внесении изменений в эту рабочую колоду, например, при добавлении зарезервированных (предопределённых) карт с последующим новым расчётом и новом клике по кнопке «Сохранить в списке» новая рассчитанная колода будет сохранена вместо этой выделенной, рассчитанной прежде! Если вы хотите сохранить в списке новый расклад, перед ним нажмите на кнопку «Новая». При этом, в списке сохранённых колод ни одна из них не будет выделена.

***
Если у вас вдруг возникло глупое желание пожертвовать мне денежку, бескорыстно или нет, вы можете сделать это здесь: <https://www.paypal.me/niaouveas>. Бескорыстное желание, если таковое имеется, можно выразить, написав письмо на [assador@gmail.com](mailto:assador@gmail.com).

Это свободное программное обеспечение, опубликованное под GNU GPL v3 (см. файл LICENSE).

***
## And one more time by English…

The free script for Medici solitaire folding. I’ve seen other implementations, but I haven’t found any open source code. The guy who wrote the Windows PM Calculator at the beginning of the century, as far as I know, did not open source. I figured that it makes sense to write such a thing in TypeScript — there won’t be any complicated calculations, so JS engines speeds are acceptable, but it is cheap, simple and popular.

Basic library is [MediciSolitaireCalculator.ts](https://github.com/assador/medici/blob/master/src/components/MediciSolitaireCalculator/MediciSolitaireCalculator.ts). Everything else is a specific working implementation in Vue.js, which can be neglected when using the library anywhere else.

## Installation

1. Clone repository
2. Inside cloned: `npm install && npm run build`
2. Or just take [MediciSolitaireCalculator.ts](https://github.com/assador/medici/blob/master/src/components/MediciSolitaireCalculator/MediciSolitaireCalculator.ts) file and do what you want to (under the terms of GPLv3)

## Vue.js implementation description

Below is a description of how the Vue.js implementation works. It can be used freely at <https://assador.github.io/medici>.

### The “Working deck” block

This block will display a folded deck. Set the initial conditions; for example, predetermined cards at the right places. Then click on the “Fold“ button.

### The “Card Predetermination” block

Select the cards that will remain in the locations you specify (the number below the card) when calculating the folding deck. To predetermine a card, click first on the card you want in this block, then on the card in the working deck block whose position (indicated by the number below the card) you want to see the card you selected.

Below this ordered deck block, the cards you have already predetermined are shown. To remove a predetermined card, click on it in this block.

### “Saved Deck List”

This block will display a list of your saved folded decks. To save the folded deck, press the “Save to list” button that appears after the calculation of the folded deck. The active “working” folded deck, shown in the main area, is highlighted in the background in this list. You can select any previously saved deck in this list. It will also appear in the “Working deck“ block. When you make changes to this working deck, such as adding reserved (predetermined) cards followed by a new calculation and clicking the “Save to list” button again, the new calculated deck will be saved instead of this previously calculated selected one! If you want to save a new deck to the list, click the “New” button before it. In this case, in the list of saved decks, none of them will be highlighted.

***
If you suddenly have a foolish desire to donate, disinterestedly or selfishly, you can do it here: <https://www.paypal.me/niaouveas>. Self-interest, if any, can be expressed by writing a letter to [assador@gmail.com](mailto:assador@gmail.com).

This is a free software published under GNU GPL v3 (see LICENSE file).
