// Функция создания карточки
function createCard(cardData, currentUserId, handleDeleteCard, handleLikeCard, handleCardClick) {
  // Клонируем шаблон
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  
  // Находим элементы
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Устанавливаем значения
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
  // Устанавливаем количество лайков
  if (likeCount) {
    likeCount.textContent = cardData.likes.length;
  }
  
  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = cardData.likes.some(user => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_active');
  }
  
  // Показываем кнопку удаления только для своих карточек
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Добавляем обработчики
  deleteButton.addEventListener('click', () => handleDeleteCard(cardElement, cardData._id));
  likeButton.addEventListener('click', () => {
    const currentIsLiked = likeButton.classList.contains('card__like-button_active');
    handleLikeCard(cardData._id, likeButton, likeCount, currentIsLiked);
  });
  cardImage.addEventListener('click', () => handleCardClick(cardData));

  return cardElement;
}

// Функция удаления карточки
function handleDeleteCard(cardElement, cardId) {
  cardElement.remove();
}

export { createCard, handleDeleteCard }; 