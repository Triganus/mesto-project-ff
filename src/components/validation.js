import { debounce } from './debounce.js';

// Показать ошибку валидации
function showInputError(formElement, inputElement, errorMessage, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
}

// Скрыть ошибку валидации
function hideInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = '';
}

// Проверить валидность поля
function checkInputValidity(formElement, inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    // Используем кастомное сообщение из data-атрибута
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

// Проверить есть ли невалидные поля
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

// Переключить состояние кнопки
function toggleButtonState(inputList, buttonElement, validationConfig) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
}

// Установить слушатели событий для формы
function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  // Проверим начальное состояние кнопки
  toggleButtonState(inputList, buttonElement, validationConfig);

  // Создаем дебаунсированную функцию валидации
  const debouncedValidation = debounce((inputElement) => {
    checkInputValidity(formElement, inputElement, validationConfig);
    toggleButtonState(inputList, buttonElement, validationConfig);
  }, 300);

  inputList.forEach((inputElement) => {
    // Мгновенная валидация для некоторых событий
    inputElement.addEventListener('blur', () => {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });

    // Дебаунсированная валидация для ввода
    inputElement.addEventListener('input', () => {
      // Для пустых полей - мгновенная валидация
      if (inputElement.value.trim() === '') {
        checkInputValidity(formElement, inputElement, validationConfig);
        toggleButtonState(inputList, buttonElement, validationConfig);
      } else {
        // Для заполненных полей - дебаунсированная валидация
        debouncedValidation(inputElement);
      }
    });
  });
}

// Включить валидацию для всех форм
function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig);
  });
}

// Очистить ошибки валидации
function clearValidation(formElement, validationConfig, forceDisableButton = false) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
    inputElement.setCustomValidity('');
  });

  if (forceDisableButton) {
    // Принудительно деактивировать кнопку (для пустых форм)
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    // Проверить состояние кнопки на основе валидности полей
    toggleButtonState(inputList, buttonElement, validationConfig);
  }
}

export { enableValidation, clearValidation }; 