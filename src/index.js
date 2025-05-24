import './pages/index.css';
import { initialCards } from './cards.js';
import { createCard, handleDeleteCard, handleLikeCard } from './components/card.js';
import { openModal, closeModal, setEventListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import logo from './images/logo.svg';
import avatar from './images/avatar.jpg';

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// DOM элементы
const placesList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Попапы
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Формы и поля
const editProfileForm = editProfilePopup.querySelector('.popup__form');
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const descriptionInput = editProfileForm.querySelector('.popup__input_type_description');

const addCardForm = addCardPopup.querySelector('.popup__form');
const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');

// Попап просмотра изображения
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Функция открытия попапа с изображением
function handleCardClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// Функция добавления карточки на страницу
function addCard(cardData) {
  const cardElement = createCard(
    cardData,
    handleDeleteCard,
    handleLikeCard,
    handleCardClick
  );
  placesList.prepend(cardElement);
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(editProfilePopup);
}

// Обработчик отправки формы добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  addCard(newCard);
  evt.target.reset();
  clearValidation(addCardForm, validationConfig, true);
  closeModal(addCardPopup);
}

// Обработчик клика по кнопке редактирования профиля
function handleEditProfileClick() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, validationConfig);
  openModal(editProfilePopup);
}

// Обработчик клика по кнопке добавления карточки
function handleAddCardClick() {
  openModal(addCardPopup);
}

// Добавление обработчиков событий
profileEditButton.addEventListener('click', handleEditProfileClick);
addCardButton.addEventListener('click', handleAddCardClick);
editProfileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);

// Добавление слушателей для модальных окон
setEventListeners(editProfilePopup);
setEventListeners(addCardPopup);
setEventListeners(imagePopup);

// Включение валидации
enableValidation(validationConfig);

// Инициализация карточек
initialCards.forEach((cardData) => {
  addCard(cardData);
});

// Установка изображений
document.querySelector('[data-logo]').src = logo;
document.querySelector('[data-avatar]').style.backgroundImage = `url(${avatar})`;
