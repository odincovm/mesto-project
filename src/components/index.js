// Импорты
import avatarImage from '../images/avatar.jpg';
import logoImage from '../images/logo.svg';
import '../pages/index.css';
import { toggleButtonState } from './validation.js';
import { openModal, closeModal, handleOverlayClick } from './modal.js';
import { createCard } from './cards.js';
// Импорт API-функций
import {
  getUserProfile,
  getInitialCards,
  updateUserProfile,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
  updateAvatar,
} from './api.js';

// Применение изображений через JavaScript
const avatarElement = document.querySelector('.profile__image');
avatarElement.style.backgroundImage = `url(${avatarImage})`;

const logoElement = document.querySelector('.header__logo');
logoElement.src = logoImage;

// Элементы на странице для данных пользователя
const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const profileAvatarElement = document.querySelector('.profile__image');

// Контейнер для карточек
const cardList = document.querySelector('.places__list');

// Элементы поп-апов
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_update-avatar');

// Кнопки закрытия поп-апов
const closeButtons = document.querySelectorAll('.popup__close');
closeButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const popup = event.target.closest('.popup');
    closeModal(popup);
  });
});

// Форма редактирования профиля
const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');

// Форма добавления новой карточки
const addCardButton = document.querySelector('.profile__add-button');
const cardFormElement = cardPopup.querySelector('.popup__form');
const placeNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');

// Форма обновления аватара
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarFormElement.querySelector('.popup__input_type_avatar-url');

// Переменная для хранения ID текущего пользователя
let currentUserId = null;

// Загрузка информации о пользователе с сервера
getUserProfile()
  .then((userData) => {
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    profileAvatarElement.style.backgroundImage = `url(${userData.avatar})`;
    currentUserId = userData._id; // Сохраняем ID текущего пользователя
  })
  .catch((err) => {
    console.error(`Ошибка загрузки профиля: ${err}`);
  });

// Функция для отображения карточек
function renderCards(cards) {
  cards.forEach((cardData) => {
    const cardElement = createCard(cardData, currentUserId);
    cardList.append(cardElement);
  });
}

// Загрузка карточек с сервера
getInitialCards()
  .then((cards) => {
    renderCards(cards);
  })
  .catch((err) => {
    console.error(`Ошибка загрузки карточек: ${err}`);
  });

// Открытие формы редактирования профиля
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileDescriptionElement.textContent;
  openModal(profilePopup);
});

// Обработка отправки формы редактирования профиля
profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = 'Сохранение...';

  const updatedUserData = { name: nameInput.value, about: jobInput.value };
  updateUserProfile(updatedUserData)
    .then((userData) => {
      profileNameElement.textContent = userData.name;
      profileDescriptionElement.textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.error(`Ошибка обновления профиля: ${err}`);
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
});

// Открытие формы добавления новой карточки
addCardButton.addEventListener('click', () => {
  placeNameInput.value = '';
  cardLinkInput.value = '';
  openModal(cardPopup);
});

// Обработка отправки формы добавления карточки
cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = 'Создание...';

  const newCardData = { name: placeNameInput.value, link: cardLinkInput.value };
  addNewCard(newCardData)
    .then((cardData) => {
      const newCard = createCard(cardData, currentUserId);
      cardList.prepend(newCard);
      closeModal(cardPopup);
    })
    .catch((err) => {
      console.error(`Ошибка добавления карточки: ${err}`);
    })
    .finally(() => {
      submitButton.textContent = 'Создать';
    });
});

// Открытие формы редактирования аватара
profileAvatarElement.addEventListener('click', () => {
  avatarInput.value = '';
  openModal(avatarPopup);
});

// Обработка отправки формы обновления аватара
avatarFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitButton.textContent = 'Сохранение...';

  const avatarUrl = avatarInput.value;
  updateAvatar(avatarUrl)
    .then((userData) => {
      profileAvatarElement.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
      avatarFormElement.reset();
    })
    .catch((err) => {
      console.error(`Ошибка обновления аватара: ${err}`);
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
});

// Валидация формы аватара
avatarInput.addEventListener('input', () => {
  const inputs = [avatarInput];
  const submitButton = avatarFormElement.querySelector('.popup__button');
  toggleButtonState(inputs, submitButton);
});
