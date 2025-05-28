import './pages/index.css';
import { createCard, handleDeleteCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal, setEventListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { loadingManager } from './components/loadingAnimation.js';
import { domCache } from './components/debounce.js';
import { 
  getUserInfo, 
  getInitialCards, 
  updateUserInfo, 
  addNewCard, 
  deleteCard, 
  updateAvatar 
} from './components/api.js';
import logo from './images/logo.svg';

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Глобальные переменные
let currentUser = null;
let cardToDelete = null;

// DOM элементы с кэшированием
const placesList = domCache.get('.places__list');
const profileEditButton = domCache.get('.profile__edit-button');
const addCardButton = domCache.get('.profile__add-button');
const profileTitle = domCache.get('.profile__title');
const profileDescription = domCache.get('.profile__description');
const profileImage = domCache.get('[data-avatar]');
const avatarButton = domCache.get('.profile__avatar-button');

// Попапы
const editProfilePopup = domCache.get('.popup_type_edit');
const addCardPopup = domCache.get('.popup_type_new-card');
const imagePopup = domCache.get('.popup_type_image');
const avatarPopup = domCache.get('.popup_type_avatar');
const deletePopup = domCache.get('.popup_type_delete');

// Формы и поля
const editProfileForm = editProfilePopup.querySelector('.popup__form');
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const descriptionInput = editProfileForm.querySelector('.popup__input_type_description');

const addCardForm = addCardPopup.querySelector('.popup__form');
const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');

const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');

const deleteForm = deletePopup.querySelector('.popup__form');

// Попап просмотра изображения
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Функция изменения текста кнопки во время загрузки (обновленная)
function renderLoading(button, isLoading, loadingText = 'Сохранение...', defaultText = 'Сохранить') {
  if (isLoading) {
    loadingManager.showButtonLoading(button, loadingText);
  } else {
    loadingManager.hideButtonLoading(button);
  }
}

// Функция открытия попапа с изображением
function handleCardClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// Функция добавления карточки на страницу с анимацией
function addCard(cardData, prepend = false) {
  const cardElement = createCard(
    cardData,
    currentUser._id,
    handleDeleteCardClick,
    handleCardClick
  );
  
  // Добавляем анимацию появления
  cardElement.style.animationDelay = prepend ? '0s' : `${Math.random() * 0.3}s`;
  
  if (prepend) {
    placesList.prepend(cardElement);
  } else {
    placesList.append(cardElement);
  }
}

// Обработчик клика по кнопке удаления карточки
function handleDeleteCardClick(cardElement, cardId) {
  cardToDelete = { element: cardElement, id: cardId };
  openModal(deletePopup);
}

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  
  renderLoading(submitButton, true);
  
  updateUserInfo(nameInput.value, descriptionInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editProfilePopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

// Обработчик отправки формы добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  
  renderLoading(submitButton, true);
  
  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then((newCard) => {
      addCard(newCard, true);
      evt.target.reset();
      clearValidation(addCardForm, validationConfig, true);
      closeModal(addCardPopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

// Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  
  renderLoading(submitButton, true);
  
  updateAvatar(avatarInput.value)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      evt.target.reset();
      clearValidation(avatarForm, validationConfig, true);
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

// Обработчик подтверждения удаления карточки
function handleDeleteFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  
  renderLoading(submitButton, true, 'Удаление...', 'Да');
  
  deleteCard(cardToDelete.id)
    .then(() => {
      cardToDelete.element.remove();
      closeModal(deletePopup);
      cardToDelete = null;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(submitButton, false, 'Удаление...', 'Да');
    });
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

// Обработчик клика по аватару
function handleAvatarClick() {
  openModal(avatarPopup);
}

// Добавление обработчиков событий
profileEditButton.addEventListener('click', handleEditProfileClick);
addCardButton.addEventListener('click', handleAddCardClick);
avatarButton.addEventListener('click', handleAvatarClick);
editProfileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);
deleteForm.addEventListener('submit', handleDeleteFormSubmit);

// Добавление слушателей для модальных окон
setEventListeners(editProfilePopup);
setEventListeners(addCardPopup);
setEventListeners(imagePopup);
setEventListeners(avatarPopup);
setEventListeners(deletePopup);

// Включение валидации
enableValidation(validationConfig);

// Инициализация приложения с индикатором загрузки
loadingManager.showGlobalLoading();

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    currentUser = userData;
    
    // Обновляем информацию о пользователе
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    
    // Добавляем карточки с задержкой для плавной анимации
    cardsData.forEach((cardData, index) => {
      setTimeout(() => {
        addCard(cardData);
      }, index * 100); // Задержка 100мс между карточками
    });
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    // Скрываем индикатор загрузки
    setTimeout(() => {
      loadingManager.hideGlobalLoading();
    }, 500);
  });

// Установка изображений
document.querySelector('[data-logo]').src = logo;
