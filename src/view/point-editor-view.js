import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { getDateEdit, compareDates } from '../utils/dayjs.js';
import he from 'he';

const FORMAT_DATE = 'd/m/y H:i';


const getOfferComponent = (offers, offersState, offersAll, typePointState, typePoint, isDisabled) => {
  let typePointOffers = [];
  const currentOffers = offersState.length !== 0 ? offersState : offers;
  if(typePointState !== '') {
    typePointOffers = offersAll.find((elem) => elem.type === typePointState).offers;
  } else if (typePoint !== '') {
    typePointOffers = offersAll.find((elem) => elem.type === typePoint).offers;
  }

  return `<section class="event__section  event__section--offers ${typePointOffers.length === 0 ? 'visually-hidden' : ''}">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
              ${typePointOffers.map((offer, index) => `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index}" ${isDisabled ? 'disabled' : ''}
                  type="checkbox" name="event-offer-luggage" ${currentOffers.includes(offer.id) ? 'checked' : ''}>
                <label class="event__offer-label" for="event-offer-luggage-${index}">
                  <span class="event__offer-title">${offer.title}</span>
                  +€&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
                </label>
              </div>`).join(' ')}
              </div>
          </section>`;
};


const getDescriptionComponent = (destination) => {
  if (destination.name !== '') {
    const photos = destination.pictures.map((currentPicture) => `<img class="event__photo" src="${currentPicture.src}" alt="Event photo">`).join(' ');
    const description = destination.description;
    return `<section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>
              <div class="event__photos-container">
                  <div class="event__photos-tape">
                      ${photos}
                  </div>
              </div>
            </section>`;
  }
  return '';
};

const getDateFromEdit = (dateFromState, state) => {
  if(dateFromState !== '') {
    return dateFromState;
  }
  if(state.dateFrom !== '') {
    return getDateEdit(state.dateFrom);
  }
  return '';
};

const getDateToEdit = (dateToState, state) => {
  if(dateToState !== '') {
    return dateToState;
  }
  if(state.dateTo !== '') {
    return getDateEdit(state.dateTo);
  }
  return '';
};

const getDataListTemplate = (destinationsAll) => {
  let dataListTemplate = '';
  destinationsAll.forEach((currentDestination) => {
    dataListTemplate = `${dataListTemplate} <option value='${currentDestination.name}'>${currentDestination.name}</option>`;
  });
};

const createPointEditTemplate = (state, offersAll, destinationsAll) => {
  const { typePoint,
    dateFromState,
    dateToState,
    typePointState,
    destinationState,
    priceState,
    isDisabled,
    isSaving,
    isDeleting,
    offersState,
    offers,
  } = state;

  //отрисовка состояния при смене типа и места назначения.
  let typePointIconTemplate = typePointState !== '' ? typePointState : typePoint.toLowerCase();
  const typePointTemplate = typePointState !== '' ? typePointState : typePoint;

  //офферы для типа точки,
  //это только для отрисовки, при отправке формы будем отдельно получать офферы.
  const offersComponent = getOfferComponent(offers, offersState, offersAll, typePointState, typePoint, isDisabled);

  const destination = destinationState.name !== '' ? destinationState : state.destination;
  const name = destination === undefined ? '' : destination.name;
  const dateFromEdit = getDateFromEdit(dateFromState, state);
  const dateToEdit = getDateToEdit(dateToState, state);
  const price = priceState !== '' ? priceState : state.basePrice;

  //подставляем все наименования точек
  const dataListTemplate = getDataListTemplate(destinationsAll);

  //иконки для типов точек
  typePointIconTemplate = typePointIconTemplate !== '' ? `img/icons/${typePointIconTemplate}.png` : '';

  //описание и фото для названия точки
  const descriptionComponent = getDescriptionComponent(destination);

  return `<ul class="trip-events__list">
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${typePointIconTemplate}" alt="">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${typePointIconTemplate === 'taxi' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${typePointIconTemplate === 'bus' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${typePointIconTemplate === 'train' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${typePointIconTemplate === 'ship' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${typePointIconTemplate === 'drive' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${typePointIconTemplate === 'flight' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${typePointIconTemplate === 'check-in' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${typePointIconTemplate === 'sightseeing' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${typePointIconTemplate === 'restaurant' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${typePointTemplate}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(name)}" ${isDisabled ? 'disabled' : ''} list="destination-list-1" autocomplete="off">
          <datalist id="destination-list-1">
            ${dataListTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromEdit}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToEdit}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min = "0" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">

      ${offersComponent}

      ${descriptionComponent}

      </section>
    </form>
  </li>
  </ul>
  `;
};


export default class PointEditorView extends SmartView {
  constructor(point, offers, destinations) {
    super();
    this._point = point;
    this._offers = offers;
    this._destinations = destinations;
    this._submitHandler = this._submitHandler.bind(this);
    this._rollupClick = this._rollupClick.bind(this);
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._state = PointEditorView.parseDataToState(this._point);
    this._changeEventTypeHandler = this._changeEventTypeHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offerClickHandler = this._offerClickHandler.bind(this);
    this._setInnerHandlers();
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более ненужный календарь
  removeElement() {
    super.removeElement();

    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEditorView.parseDataToState(this._point));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  resetState(point) {
    this.updateData(
      PointEditorView.parseDataToState(point),
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('click', this._changeEventTypeHandler);
    this._setDateFromPicker();
    this._setDateToPicker();
    this.getElement().querySelector('#event-destination-1').addEventListener('input', this._destinationInputHandler);
    this.getElement().querySelector('#event-price-1').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__available-offers').addEventListener('click', this._offerClickHandler);
  }

  _includeOffers(justDataUpdating = false) {
    const offers = this._state.typePointState !== '' ?
      this._offers.find((offer) => offer.type === this._state.typePointState).offers :
      this._offers.find((offer) => offer.type === this._state.typePoint).offers;

    const offersElement = this.getElement().querySelectorAll('.event__offer-checkbox');
    const includedOffers = [];
    offersElement.forEach((offerElement) => {
      const title = offerElement.parentElement.querySelector('.event__offer-title').textContent;
      if (offerElement.checked) {
        includedOffers.push(offers.find((offer) => offer.title === title).id);
      }
    });
    this.updateData({
      offersState: includedOffers,
    }, justDataUpdating);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      priceState: Number(evt.target.value),
    }, true);
  }

  //проверяем введенное пользователем название точки, если по нему нашли описание - делаем updateData,
  //если не нашли (пользователь ввел что-то свое), то при отправке формы подставится последнее сохраненное на форме описание точки.
  _destinationInputHandler(evt) {
    const destination = this._destinations.find((dectination) => dectination.name === evt.target.value);
    if(!destination) {
      return;
    }
    evt.preventDefault();
    this.updateData({
      destinationState: destination,
    }, false);
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }
    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'), {
        dateFormat: FORMAT_DATE,
        enableTime: true,
        defaultDate: this.getElement().querySelector('#event-start-time-1').value,
        onChange: this._dateFromChangeHandler,
      },
    );
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
    this._dateToPicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'), {
        dateFormat: FORMAT_DATE,
        enableTime: true,
        defaultDate: this.getElement().querySelector('#event-end-time-1').value,
        onChange: this._dateToChangeHandler,
      },
    );
  }

  _checkDataMinMax(fromTo) {
    const dataFrom = this.getElement().querySelector('#event-start-time-1');
    const dataTo = this.getElement().querySelector('#event-end-time-1');
    if (dataFrom.value && dataTo.value && compareDates(dataFrom.value, dataTo.value) < 0) {
      // eslint-disable-next-line no-unused-expressions
      fromTo === 'to' ? dataTo.value = '' : dataFrom.value = '';
    }
    return true;
  }

  _dateFromChangeHandler() {
    if (!this._checkDataMinMax('from')) {
      return;
    }
    this.updateData({
      dateFromState: this.getElement().querySelector('#event-start-time-1').value,
      dateFromPicker: this._dateFromPicker.selectedDates,
    });
  }

  _dateToChangeHandler() {
    if (!this._checkDataMinMax('to')) {
      return;
    }
    this.updateData({
      dateToState: this.getElement().querySelector('#event-end-time-1').value,
      dateToPicker: this._dateToPicker.selectedDates,
    });
  }

  _getOffersId(type) {
    const offers = this._offers.find((offer) => offer.type === type).offers;
    return offers.map((offer) => offer.id);
  }

  _changeEventTypeHandler(evt) {
    if (evt.target.tagName === 'LABEL') {
      this.updateData({
        typePointState: (evt.target.textContent).toLowerCase(),
        offersState: this._getOffersId((evt.target.textContent).toLowerCase()),
      });
    }
  }

  _offerClickHandler() {
    this._includeOffers(true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitFormHandler(this._callback.submitClick);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  static parseDataToState(data) {
    return Object.assign({},
      data, {
        typePointState: '',
        destinationState: {
          name: '',
          description: '',
          pictures: []
        },
        dateFromState: '',
        dateToState: '',
        dateFromPicker: '',
        dateToPicker: '',
        priceState: '',
        offersState: [],
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseStateToData(state) {
    const data = Object.assign({}, state,
      Object.assign({},
        {
          typePoint: state.typePointState !== '' ? state.typePointState : state.typePoint,
          offers: state.offersState !== [] ? state.offersState : state.offers,
          destination: state.destinationState.name !== '' ? state.destinationState : state.destination,
          basePrice: state.priceState !== '' ? state.priceState : state.basePrice,
          dateTo: state.dateToState !== '' ? state.dateToPicker : state.dateTo,
          dateFrom: state.dateFromState !== '' ? state.dateFromPicker : state.dateFrom,
        },
      )
    );

    delete data.typePointState;
    delete data.destinationState;
    delete data.dateFromState;
    delete data.dateToState;
    delete data.dateFromPicker;
    delete data.dateToPicker;
    delete data.priceState;
    delete data.offersState;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  getTemplate() {
    return createPointEditTemplate(this._state, this._offers, this._destinations);
  }

  //вызывается при отправке формы, проверяем выбрал ли пользователь точку, а если выбрал, то
  //корректно ли указал название. Если по названию не смогли найти объект с описанием точки -
  //не отправляем форму.
  _isDestinationCorrect() {

    //если название точки менялось
    if(this._state.destinationState.name !== '') {
      const destinationState = this._destinations.find((dectination) => dectination.name === this._state.destinationState.name);
      if(destinationState) {
        this._state.destinationState = destinationState;
        return true;
      } else {
        return false;
      }
    }
    //а здесь ищем объект для прежней точки (если она не менялась), у новой точки оно пустое.
    const destination = this._destinations.find((dectination) => dectination.name === this._state.destination.name);
    if(destination) {
      this._state.destination = destination;
      return true;
    } else {
      return false;
    }
  }

  //вызывает _handleViewAction из trip-presenter`a с добавлением новой точки если передается из PointNewPresenter
  //далее добавляет в общий список точек новую точку и вызывает обзервер Модели - _handleModelEvent с параметром
  _submitHandler(evt) {
    evt.preventDefault();
    if (!this._isDestinationCorrect()) {
      return;
    }
    this._includeOffers();
    this._callback.submitClick(PointEditorView.parseStateToData(this._state));
  }

  setSubmitFormHandler(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector('.event').addEventListener('submit', this._submitHandler);
  }

  _rollupClick(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClick);
  }
}
