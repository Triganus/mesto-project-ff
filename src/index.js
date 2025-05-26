import './pages/index.css';
import { createCard, handleDeleteCard } from './components/card.js';
import { openModal, closeModal, setEventListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { 
  getUserInfo, 
  getInitialCards, 
  updateUserInfo, 
  addNewCard, 
  deleteCard, 
  likeCard, 
  unlikeCard, 
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

// DOM элементы
const placesList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('[data-avatar]');
const avatarButton = document.querySelector('.profile__avatar-button');

// Попапы
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar');
const deletePopup = document.querySelector('.popup_type_delete');

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

// Функция изменения текста кнопки во время загрузки
function renderLoading(button, isLoading, loadingText = 'Сохранение...', defaultText = 'Сохранить') {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

// Функция открытия попапа с изображением
function handleCardClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// Функция добавления карточки на страницу
function addCard(cardData, prepend = false) {
  const cardElement = createCard(
    cardData,
    currentUser._id,
    handleDeleteCardClick,
    handleLikeCard,
    handleCardClick
  );
  
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

// Обработчик лайка карточки
function handleLikeCard(cardId, likeButton, likeCount, isLiked) {
  const likeMethod = isLiked ? unlikeCard : likeCard;
  
  likeMethod(cardId)
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_active');
      if (likeCount) {
        likeCount.textContent = updatedCard.likes.length;
      }
    })
    .catch((err) => {
      console.log(err);
    });
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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

// Инициализация приложения
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    currentUser = userData;
    
    // Обновляем информацию о пользователе
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    
    // Добавляем карточки
    cardsData.forEach((cardData) => {
      addCard(cardData);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Установка изображений
document.querySelector('[data-logo]').src = logo;
