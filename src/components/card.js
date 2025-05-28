import { likeCard, unlikeCard } from './api.js';
import { lazyLoader } from './lazyLoading.js';

// Обработчик лайка карточки
function handleLikeClick(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains('card__like-button_active');
  const likeMethod = isLiked ? unlikeCard : likeCard;
  
  // Добавляем анимацию клика
  likeButton.style.pointerEvents = 'none';
  
  likeMethod(cardId)
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_active');
      if (likeCount) {
        likeCount.textContent = updatedCard.likes.length;
        // Анимация изменения счетчика
        likeCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
          likeCount.style.transform = 'scale(1)';
        }, 200);
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      // Восстанавливаем возможность клика
      setTimeout(() => {
        likeButton.style.pointerEvents = 'auto';
      }, 300);
    });
}

// Функция создания карточки
function createCard(cardData, currentUserId, handleDeleteCard, handleCardClick) {
  // Клонируем шаблон
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  
  // Находим элементы
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Настраиваем ленивую загрузку изображения
  cardImage.dataset.src = cardData.link;
  cardImage.alt = cardData.name;
  cardImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+'; // Прозрачный placeholder
  
  // Запускаем ленивую загрузку
  lazyLoader.observe(cardImage);
  
  cardTitle.textContent = cardData.name;
  
  // Устанавливаем количество лайков с анимацией
  if (likeCount) {
    likeCount.textContent = cardData.likes.length;
    likeCount.style.transition = 'transform 0.2s ease';
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
    handleLikeClick(cardData._id, likeButton, likeCount);
  });
  cardImage.addEventListener('click', () => handleCardClick(cardData));

  // Добавляем задержку для анимации появления карточки
  setTimeout(() => {
    cardElement.style.animationDelay = '0s';
  }, 100);

  return cardElement;
}

// Функция удаления карточки с анимацией
function handleDeleteCard(cardElement, cardId) {
  // Добавляем анимацию удаления
  cardElement.style.transform = 'scale(0.8)';
  cardElement.style.opacity = '0';
  cardElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  
  setTimeout(() => {
    cardElement.remove();
  }, 300);
}

export { createCard, handleDeleteCard, handleLikeClick }; 