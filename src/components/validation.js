// Универсальная функция показа ошибки
function showInputError(formElement, inputElement, errorMessage) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__error_visible');
}

// Универсальная функция скрытия ошибки
function hideInputError(formElement, inputElement) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove('popup__input_type_error');
  errorElement.textContent = '';
  errorElement.classList.remove('popup__error_visible');
}

// Проверка валидности поля
function checkInputValidity(formElement, inputElement) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
}

// Переключение состояния кнопки
function toggleButtonState(inputs, submitButton) {
  const isValid = inputs.every((input) => input.validity.valid);
  if (isValid) {
    submitButton.classList.remove('popup__button_disabled');
    submitButton.disabled = false;
  } else {
    submitButton.classList.add('popup__button_disabled');
    submitButton.disabled = true;
  }
}

// Установка обработчиков событий для валидации
function setEventListeners(formElement) {
  const inputs = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  // Первичная проверка состояния кнопки
  toggleButtonState(inputs, buttonElement);

  inputs.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputs, buttonElement);
    });
  });
}

// Функция инициализации валидации всех форм
function enableValidation() {
  const forms = Array.from(document.querySelectorAll('.popup__form'));
  forms.forEach((formElement) => {
    setEventListeners(formElement);
  });
}

// Вызов функции инициализации после загрузки страницы
enableValidation();
export{toggleButtonState}