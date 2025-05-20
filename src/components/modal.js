// Функция открытия модального окна
function openModal(modalElement) {
  modalElement.classList.add('popup_opened');
  document.addEventListener('keydown', handleEscClose);
}

// Функция закрытия модального окна
function closeModal(modalElement) {
  modalElement.classList.remove('popup_opened');
  document.removeEventListener('keydown', handleEscClose);
}

// Обработчик закрытия по клавише Esc
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Функция для добавления слушателей к модальному окну
function setEventListeners(modalElement) {
  // Закрытие при клике на крестик
  const closeButton = modalElement.querySelector('.popup__close');
  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(modalElement));
  }

  // Закрытие при клике на оверлей
  modalElement.addEventListener('mousedown', (evt) => {
    if (evt.target === modalElement) {
      closeModal(modalElement);
    }
  });
}

export { openModal, closeModal, setEventListeners }; 