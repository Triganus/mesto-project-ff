// Функция создания карточки
function createCard(cardData, handleDeleteCard, handleLikeCard, handleCardClick) {
  // Клонируем шаблон
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  
  // Находим элементы
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  // Устанавливаем значения
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчики
  deleteButton.addEventListener('click', () => handleDeleteCard(cardElement));
  likeButton.addEventListener('click', () => handleLikeCard(likeButton));
  cardImage.addEventListener('click', () => handleCardClick(cardData));

  return cardElement;
}

// Функция обработки лайка
function handleLikeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_active');
}

// Функция удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}

export { createCard, handleDeleteCard, handleLikeCard }; 