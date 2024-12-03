// Импорты
import avatarImage from '../images/avatar.jpg';
import logoImage from '../images/logo.svg';
import '../pages/index.css';
import { initialCards } from './cards.js';
import { toggleButtonState } from './validation.js';
import{openModal,closeModal,handleOverlayClick}from './modal.js'
// Применение изображений через JavaScript
const avatarElement = document.querySelector('.profile__image');
avatarElement.style.backgroundImage = `url(${avatarImage})`;

const logoElement = document.querySelector('.header__logo');
logoElement.src = logoImage;


// Функция для создания карточки
function createCard(cardData) {
  const template = document.querySelector('#card-template').content;
  const cardElement = template.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  // Добавляем функционал лайка
  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-button_is-active');
  });

  // Добавляем функционал удаления карточки
  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  // Добавляем функционал открытия изображения
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

// Контейнер для карточек
const cardList = document.querySelector('.places__list');

// Добавляем карточки из массива
initialCards.forEach((cardData) => {
  const card = createCard(cardData);
  cardList.append(card);
});

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

// Открытие формы редактирования профиля
profileEditButton.addEventListener('click', () => {
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent;
  openModal(profilePopup);
});

// Функция для обработки отправки формы редактирования
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  document.querySelector('.profile__title').textContent = nameInput.value;
  document.querySelector('.profile__description').textContent = jobInput.value;
  closeModal(profilePopup);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Форма добавления новой карточки
const addCardButton = document.querySelector('.profile__add-button');
const cardFormElement = cardPopup.querySelector('.popup__form');
const placeNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');

// Открытие формы добавления новой карточки
addCardButton.addEventListener('click', () => {
  placeNameInput.value = '';
  cardLinkInput.value = '';
  openModal(cardPopup);
});

// Функция для обработки отправки формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: placeNameInput.value,
    link: cardLinkInput.value
  };
  const newCard = createCard(newCardData);
  cardList.prepend(newCard);
  closeModal(cardPopup);
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);

// Добавляем модификатор для плавного открытия поп-апов
document.querySelectorAll('.popup').forEach((popup) => {
  popup.classList.add('popup_is-animated');
});
