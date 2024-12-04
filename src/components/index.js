// Импорты
import avatarImage from '../images/avatar.jpg';
import logoImage from '../images/logo.svg';
import '../pages/index.css';
import { toggleButtonState } from './validation.js';
import { openModal, closeModal, handleOverlayClick } from './modal.js';

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

// Функция для создания карточки
function createCard(cardData, currentUserId) {
  const template = document.querySelector('#card-template').content;
  const cardElement = template.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверяем, поставил ли текущий пользователь лайк
  if (cardData.likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Обработка лайка
  likeButton.addEventListener('click', () => {
    if (likeButton.classList.contains('card__like-button_is-active')) {
      unlikeCard(cardData._id)
        .then((updatedCard) => {
          likeButton.classList.remove('card__like-button_is-active');
          likeCount.textContent = updatedCard.likes.length;
        })
        .catch((err) => {
          console.error('Ошибка при снятии лайка:', err);
        });
    } else {
      likeCard(cardData._id)
        .then((updatedCard) => {
          likeButton.classList.add('card__like-button_is-active');
          likeCount.textContent = updatedCard.likes.length;
        })
        .catch((err) => {
          console.error('Ошибка при постановке лайка:', err);
        });
    }
  });

  // Скрываем кнопку удаления, если карточка не принадлежит текущему пользователю
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Удаление карточки
  deleteButton.addEventListener('click', () => {
    deleteCard(cardData._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.error('Ошибка при удалении карточки:', err);
      });
  });

  // Открытие изображения
  cardImage.addEventListener('click', () => {
    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopup);
  });

  return cardElement;
}

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

const avatarPopup = document.querySelector('.popup_type_update-avatar');
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarFormElement.querySelector('.popup__input_type_avatar-url');

// Открытие формы редактирования аватара
profileAvatarElement.addEventListener('click', () => {
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
