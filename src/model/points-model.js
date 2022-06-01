import Observer from '../utils/observer.js';
import { getFuturePoints, getPastPoints } from '../utils/dayjs.js';
import { getSortPricePoints, getSortDayPoints, getSortTimePoints, copy } from '../utils/common.js';
import { FilterType, SortMode } from '../utils/const.js';

export default class PointsModel extends Observer {

  #points = [];
  #offers = [];
  #destinations = [];
  #filtersBlock = {};
  #error = false;

  constructor() {
    super();
  }

  setPoints(updateType, value) {
    this.#points = value[0]; //
    this.#destinations = value[1];
    this.#offers = value[2];
    this.#error = value.length === 4 ? value[3] : false;

    //здесь вызываются два обзервера:
    //1. установлен в FilterPresenter (вызывает init у фильтров)
    //2. установленный в TripPresenter (вызывает _renderPoints)
    this._notify(updateType);
  }

  //получает фильтры которые нужно заблокировать (сделать неактивными)
  getFiltersBlock() {
    const points = copy(this.#points);
    this.#filtersBlock[FilterType.EVERYTHING] = !(points.length > 0);
    this.#filtersBlock[FilterType.PAST] = !(getPastPoints(points).length > 0); //ТЕСТ-здесь поставить число точек, чтобы не удалять.
    this.#filtersBlock[FilterType.FUTURE] = !(getFuturePoints(points).length > 0); //ТЕСТ-здесь поставить число точек, чтобы не удалять.
    return this.#filtersBlock;
  }

  //получает точки (с сортировкой или фильтрацией) перед отрисовкой
  getPoints(filterType, sortMode = SortMode.DAY) {
    this._filterType = filterType;
    let points = copy(this.#points);

    //фильтрация: Прошлые, Будущие, Все
    switch (this._filterType) {
      case FilterType.PAST:
        points = getPastPoints(points);
        break;
      case FilterType.FUTURE:
        points = getFuturePoints(points);
        break;
      case FilterType.EVERYTHING:
        break;
    }

    //здесь Сортировка (день, время, цена)
    switch (sortMode) {
      case SortMode.DAY:
        points = getSortDayPoints(points);
        break;
      case SortMode.TIME:
        points = getSortTimePoints(points);
        break;
      case SortMode.PRICE:
        points = getSortPricePoints(points);
        break;
    }
    return points;
  }

  getError() {
    return this.#error;
  }

  getOffersAll() {
    return this.#offers;
  }

  getDestinationsAll() {
    return this.#destinations;
  }

  getPointsAll() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        typePoint: point.type,
        dateFrom: point.date_from,
        basePrice: point.base_price,
        dateTo: point.date_to,
        isFavorite: point.is_favorite,
        offers: point.offers,
      },
    );

    delete adaptedPoint.type;
    delete adaptedPoint.date_from;
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {

    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'type': point.typePoint,
        'date_from': point.dateFrom,
        'base_price': point.basePrice,
        'date_to': point.dateTo,
        'is_favorite': point.isFavorite,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.typePoint;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateTo;
    return adaptedPoint;
  }
}


