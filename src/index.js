import './pages/index.css';
import { initialCards } from './cards.js';

console.log('Hello, World!');

import logo from './images/logo.svg';
console.log('Путь к логотипу после сборки:', logo);

const numbers = [2, 3, 5];

// Стрелочная функция. Не запнётся ли на ней Internet Explorer?
const doubledNumbers = numbers.map(number => number * 2);

console.log(doubledNumbers); // 4, 6, 10

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(cardData, deleteCard) {
  // Клонируем шаблон один раз
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  
  // Находим все необходимые элементы один раз
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  // Устанавливаем значения
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик удаления
  deleteButton.addEventListener('click', () => deleteCard(cardElement));

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(cardData => {
  const cardElement = createCard(cardData, deleteCard);
  placesList.append(cardElement);
});
