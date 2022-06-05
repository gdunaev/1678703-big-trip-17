import { AbstractView } from './abstract-view.js';
import he from 'he';
import { getOnlyDate, getMonthDay, getDateHourMinute, getDateHour, getMinMaxDateDuration } from '../utils/dayjs.js';


const createPointItemTemplate = (point, offersAll) => {
  const {
    isFavorite,
    offers,
    typePoint,
    dateFrom,
    destination,
    dateTo,
    basePrice
  } = point;

  const dateFromOnlyDate = getOnlyDate(dateFrom);
  const dateFromMonthDay = getMonthDay(dateFrom);
  const dateFromHourMinute = getDateHourMinute(dateFrom);
  const dateFromHour = getDateHour(dateFrom);
  const dateToHourMinute = getDateHourMinute(dateTo);
  const dateToHour = getDateHour(dateTo);
  const pointDuration = getMinMaxDateDuration(dateFrom, dateTo);
  const basePriceString = String(basePrice);
  const activeFavorite = isFavorite === true ? 'event__favorite-btn--active' : '';
  let offersType = offersAll.find((elem) => elem.type === typePoint).offers;
  offersType = offersType.filter((elem) => offers.includes(elem.id));

  //здесь показываем только офферы выбранные пользователем (например 2 из 5, или 1 из 3)
  let offersComponent = '';
  if (offers !== []) {
    for (const elem of offersType) {
      offersComponent = `${offersComponent}<li class="event__offer">
                                            <span class="event__offer-title">${elem['title']}</span>
                                            &plus;&euro;&nbsp;
                                            <span class="event__offer-price">${elem['price']}</span>
                                          </li>`;
    }

    offersComponent = `<h4 class="visually-hidden">Offers:</h4>
                      <ul class="event__selected-offers">
                      ${offersComponent}
                      </ul>`;
  }
  const typePointIcon = typePoint.toLowerCase();

  return `<ul class="trip-events__list">
            <li class="trip-events__item">
              <div class="event">
              <time class="event__date" datetime=${dateFromOnlyDate}>${dateFromMonthDay}</time>
              <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${typePointIcon}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${typePoint} ${he.encode(destination.name)}</h3>
              <div class="event__schedule">
                <p class="event__time">
                <time class="event__start-time" datetime=${dateFromHourMinute}>${dateFromHour}</time>
                  &mdash;
                <time class="event__end-time" datetime=${dateToHourMinute}>${dateToHour}</time>
                </p>
                <p class="event__duration">${pointDuration}</p>
              </div>
              <p class="event__price">
                 &euro;&nbsp;<span class="event__price-value">${he.encode(basePriceString)}</span>
              </p>

              ${offersComponent}

              <button class="event__favorite-btn ${activeFavorite}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
              </button>
              </div>
            </li>
          </ul>`;

};

export default class PointView extends AbstractView {

  #point = null;
  #offers = null;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  getTemplate() {
    return createPointItemTemplate(this.#point, this.#offers);
  }

  #onRollupClick = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupClick);
  }

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  setFavoriteButtonHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteClick);
  }
}
