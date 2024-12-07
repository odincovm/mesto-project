/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/

;// ./src/images/avatar.jpg
const avatar_namespaceObject = __webpack_require__.p + "6666407ac3aa5af1d5de.jpg";
;// ./src/images/logo.svg
const logo_namespaceObject = __webpack_require__.p + "0863e5bc26221680f1e2.svg";
;// ./src/components/validation.js
// Универсальная функция показа ошибки
function showInputError(formElement, inputElement, errorMessage) {
  var errorElement = formElement.querySelector("#".concat(inputElement.id, "-error"));
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__error_visible');
}

// Универсальная функция скрытия ошибки
function hideInputError(formElement, inputElement) {
  var errorElement = formElement.querySelector("#".concat(inputElement.id, "-error"));
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
  var isValid = inputs.every(function (input) {
    return input.validity.valid;
  });
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
  var inputs = Array.from(formElement.querySelectorAll('.popup__input'));
  var buttonElement = formElement.querySelector('.popup__button');

  // Первичная проверка состояния кнопки
  toggleButtonState(inputs, buttonElement);
  inputs.forEach(function (inputElement) {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputs, buttonElement);
    });
  });
}

// Функция инициализации валидации всех форм
function enableValidation() {
  var forms = Array.from(document.querySelectorAll('.popup__form'));
  forms.forEach(function (formElement) {
    setEventListeners(formElement);
  });
}

// Вызов функции инициализации после загрузки страницы
enableValidation();

;// ./src/components/modal.js

// Универсальная функция для закрытия поп-апа нажатием на Esc
function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    var openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Функция для открытия поп-апа
function openModal(popup) {
  popup.classList.add('popup_is-opened');
  // Сброс сообщений об ошибках
  var errorMessages = popup.querySelectorAll('.popup__error');
  errorMessages.forEach(function (errorElement) {
    errorElement.textContent = '';
  });
  var inputs = Array.from(popup.querySelectorAll('.popup__input'));
  inputs.forEach(function (input) {
    input.classList.remove('popup__input_type_error');
  });

  // Обновляем состояние кнопки
  var submitButton = popup.querySelector('.popup__button');
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

;// ./src/components/api.js
var config = {
  baseUrl: 'https://nomoreparties.co/v1/frontend-st-cohort-201',
  headers: {
    authorization: '315f03f9-733f-4438-963f-5aaae1732e79',
    'Content-Type': 'application/json'
  }
};

// Общая функция проверки ответа сервера
var checkResponse = function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject("\u041E\u0448\u0438\u0431\u043A\u0430: ".concat(res.status));
};

// Получение карточек с сервера
var getInitialCards = function getInitialCards() {
  return fetch("".concat(config.baseUrl, "/cards"), {
    headers: config.headers
  }).then(checkResponse);
};

// Получение данных пользователя
var getUserProfile = function getUserProfile() {
  return fetch("".concat(config.baseUrl, "/users/me"), {
    headers: config.headers
  }).then(checkResponse);
};

// Обновление данных пользователя
var updateUserProfile = function updateUserProfile(userData) {
  return fetch("".concat(config.baseUrl, "/users/me"), {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(userData)
  }).then(checkResponse);
};

// Добавление новой карточки
var addNewCard = function addNewCard(cardData) {
  return fetch("".concat(config.baseUrl, "/cards"), {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(cardData)
  }).then(checkResponse);
};

// Удаление карточки
var deleteCard = function deleteCard(cardId) {
  return fetch("".concat(config.baseUrl, "/cards/").concat(cardId), {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
};

// Постановка лайка
var likeCard = function likeCard(cardId) {
  return fetch("".concat(config.baseUrl, "/cards/likes/").concat(cardId), {
    method: 'PUT',
    headers: config.headers
  }).then(checkResponse);
};

// Снятие лайка
var unlikeCard = function unlikeCard(cardId) {
  return fetch("".concat(config.baseUrl, "/cards/likes/").concat(cardId), {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
};

// Обновление аватара пользователя
var updateAvatar = function updateAvatar(avatarUrl) {
  return fetch("".concat(config.baseUrl, "/users/me/avatar"), {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl
    })
  }).then(checkResponse);
};
;// ./src/components/cards.js
// Функция для создания карточки
function createCard(cardData, currentUserId) {
  // Переменная для попапа просмотра изображения
  var imageViewPopup = document.querySelector('.popup_type_image');
  var template = document.querySelector('#card-template').content;
  var cardElement = template.querySelector('.card').cloneNode(true);
  var cardImage = cardElement.querySelector('.card__image');
  var cardTitle = cardElement.querySelector('.card__title');
  var likeButton = cardElement.querySelector('.card__like-button');
  var likeCount = cardElement.querySelector('.card__like-count');
  var deleteButton = cardElement.querySelector('.card__delete-button');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверяем, поставил ли текущий пользователь лайк
  if (cardData.likes.some(function (user) {
    return user._id === currentUserId;
  })) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Обработка лайка
  likeButton.addEventListener('click', function () {
    if (likeButton.classList.contains('card__like-button_is-active')) {
      unlikeCard(cardData._id).then(function (updatedCard) {
        likeButton.classList.remove('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      }).catch(function (err) {
        console.error('Ошибка при снятии лайка:', err);
      });
    } else {
      likeCard(cardData._id).then(function (updatedCard) {
        likeButton.classList.add('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      }).catch(function (err) {
        console.error('Ошибка при постановке лайка:', err);
      });
    }
  });

  // Скрываем кнопку удаления, если карточка не принадлежит текущему пользователю
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Удаление карточки
  deleteButton.addEventListener('click', function () {
    deleteCard(cardData._id).then(function () {
      cardElement.remove();
    }).catch(function (err) {
      console.error('Ошибка при удалении карточки:', err);
    });
  });
  // Открытие изображения
  cardImage.addEventListener('click', function () {
    var popupImage = imageViewPopup.querySelector('.popup__image');
    var popupCaption = imageViewPopup.querySelector('.popup__caption');
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imageViewPopup);
  });
  return cardElement;
}


;// ./src/components/index.js
// Импорты






// Импорт API-функций


// Применение изображений через JavaScript
var avatarElement = document.querySelector('.profile__image');
avatarElement.style.backgroundImage = "url(".concat(avatar_namespaceObject, ")");
var logoElement = document.querySelector('.header__logo');
logoElement.src = logo_namespaceObject;

// Элементы на странице для данных пользователя
var profileNameElement = document.querySelector('.profile__title');
var profileDescriptionElement = document.querySelector('.profile__description');
var profileAvatarElement = document.querySelector('.profile__image');

// Контейнер для карточек
var cardList = document.querySelector('.places__list');

// Элементы поп-апов
var profilePopup = document.querySelector('.popup_type_edit');
var cardPopup = document.querySelector('.popup_type_new-card');
var imagePopup = document.querySelector('.popup_type_image');
var avatarPopup = document.querySelector('.popup_type_update-avatar');

// Кнопки закрытия поп-апов
var closeButtons = document.querySelectorAll('.popup__close');
closeButtons.forEach(function (button) {
  button.addEventListener('click', function (event) {
    var popup = event.target.closest('.popup');
    closeModal(popup);
  });
});

// Форма редактирования профиля
var profileEditButton = document.querySelector('.profile__edit-button');
var profileFormElement = profilePopup.querySelector('.popup__form');
var nameInput = profilePopup.querySelector('.popup__input_type_name');
var jobInput = profilePopup.querySelector('.popup__input_type_description');

// Форма добавления новой карточки
var addCardButton = document.querySelector('.profile__add-button');
var cardFormElement = cardPopup.querySelector('.popup__form');
var placeNameInput = cardPopup.querySelector('.popup__input_type_card-name');
var cardLinkInput = cardPopup.querySelector('.popup__input_type_url');

// Форма обновления аватара
var avatarFormElement = avatarPopup.querySelector('.popup__form');
var avatarInput = avatarFormElement.querySelector('.popup__input_type_avatar-url');

// Переменная для хранения ID текущего пользователя
var currentUserId = null;

// Загрузка информации о пользователе с сервера
getUserProfile().then(function (userData) {
  profileNameElement.textContent = userData.name;
  profileDescriptionElement.textContent = userData.about;
  profileAvatarElement.style.backgroundImage = "url(".concat(userData.avatar, ")");
  currentUserId = userData._id; // Сохраняем ID текущего пользователя
}).catch(function (err) {
  console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u0440\u043E\u0444\u0438\u043B\u044F: ".concat(err));
});

// Функция для отображения карточек
function renderCards(cards) {
  cards.forEach(function (cardData) {
    var cardElement = createCard(cardData, currentUserId);
    cardList.append(cardElement);
  });
}

// Загрузка карточек с сервера
getInitialCards().then(function (cards) {
  renderCards(cards);
}).catch(function (err) {
  console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A: ".concat(err));
});

// Открытие формы редактирования профиля
profileEditButton.addEventListener('click', function () {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileDescriptionElement.textContent;
  openModal(profilePopup);
});

// Обработка отправки формы редактирования профиля
profileFormElement.addEventListener('submit', function (evt) {
  evt.preventDefault();
  var submitButton = evt.submitter;
  submitButton.textContent = 'Сохранение...';
  var updatedUserData = {
    name: nameInput.value,
    about: jobInput.value
  };
  updateUserProfile(updatedUserData).then(function (userData) {
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    closeModal(profilePopup);
  }).catch(function (err) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0444\u0438\u043B\u044F: ".concat(err));
  }).finally(function () {
    submitButton.textContent = 'Сохранить';
  });
});

// Открытие формы добавления новой карточки
addCardButton.addEventListener('click', function () {
  placeNameInput.value = '';
  cardLinkInput.value = '';
  openModal(cardPopup);
});

// Обработка отправки формы добавления карточки
cardFormElement.addEventListener('submit', function (evt) {
  evt.preventDefault();
  var submitButton = evt.submitter;
  submitButton.textContent = 'Создание...';
  var newCardData = {
    name: placeNameInput.value,
    link: cardLinkInput.value
  };
  addNewCard(newCardData).then(function (cardData) {
    var newCard = createCard(cardData, currentUserId);
    cardList.prepend(newCard);
    closeModal(cardPopup);
  }).catch(function (err) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438: ".concat(err));
  }).finally(function () {
    submitButton.textContent = 'Создать';
  });
});

// Открытие формы редактирования аватара
profileAvatarElement.addEventListener('click', function () {
  avatarInput.value = '';
  openModal(avatarPopup);
});

// Обработка отправки формы обновления аватара
avatarFormElement.addEventListener('submit', function (evt) {
  evt.preventDefault();
  var submitButton = evt.submitter;
  submitButton.textContent = 'Сохранение...';
  var avatarUrl = avatarInput.value;
  updateAvatar(avatarUrl).then(function (userData) {
    profileAvatarElement.style.backgroundImage = "url(".concat(userData.avatar, ")");
    closeModal(avatarPopup);
    avatarFormElement.reset();
  }).catch(function (err) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0430\u0432\u0430\u0442\u0430\u0440\u0430: ".concat(err));
  }).finally(function () {
    submitButton.textContent = 'Сохранить';
  });
});

// Валидация формы аватара
avatarInput.addEventListener('input', function () {
  var inputs = [avatarInput];
  var submitButton = avatarFormElement.querySelector('.popup__button');
  toggleButtonState(inputs, submitButton);
});
/******/ })()
;