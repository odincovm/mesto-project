// Функция для создания карточки
export function createCard(cardData, currentUserId) {
  // Переменная для попапа просмотра изображения
  const imageViewPopup = document.querySelector('.popup_type_image');

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
    const popupImage = imageViewPopup.querySelector('.popup__image');
    const popupCaption = imageViewPopup.querySelector('.popup__caption');
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imageViewPopup);
  });

  return cardElement;
}

import { openModal} from './modal.js';
import { unlikeCard, likeCard, deleteCard } from './api.js';
