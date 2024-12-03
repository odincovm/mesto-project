
import { toggleButtonState } from './validation.js';
// Универсальная функция для закрытия поп-апа нажатием на Esc
function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Функция для открытия поп-апа
function openModal(popup) {
  popup.classList.add('popup_is-opened');
  console.log("Поп - ап");
  // Сброс сообщений об ошибках
  const errorMessages = popup.querySelectorAll('.popup__error');
  errorMessages.forEach((errorElement) => {
    errorElement.textContent = '';
  });

  const inputs = Array.from(popup.querySelectorAll('.popup__input'));
  inputs.forEach((input) => {
    input.classList.remove('popup__input_type_error');
  });

  // Обновляем состояние кнопки
  const submitButton = popup.querySelector('.popup__button');
  if (submitButton) {
    toggleButtonState(inputs, submitButton);
  }

  document.addEventListener('keydown', closeByEsc);

   popup.addEventListener('mousedown', handleOverlayClick);
}

// Функция для закрытия поп-апа
function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEsc);
}

// Функция для закрытия поп-апа кликом на оверлей
function handleOverlayClick(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.target);
  }
}


export{openModal,closeModal}