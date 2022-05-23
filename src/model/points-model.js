import Observer from '../utils/observer.js';
import { getFuturePoints, getPastPoints } from '../utils/dayjs.js';
import { getSortPricePoints, getSortDayPoints, getSortTimePoints, copy } from '../utils/common.js';
import { FilterType,  SortMode } from '../utils/const.js';

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
    this._offers = [];
    this._destinations = [];
  }

  setPoints(updateType, value) {
    this._points = value[0]; //
    this._destinations = value[1];
    this._offers = value[2];

    //здесь вызываются два обзервера:
    //1. установлен в FilterPresenter (вызывает init у фильтров)
    //2. установленный в TripPresenter (вызывает _renderPoints)
    this._notify(updateType);
  }

  //получает точки (с сортировкой или фильтрацией) перед отрисовкой
  getPoints(filterType) {
    this._filterType = filterType;
    let points = copy(this._points);

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
    switch (this._sortMode) {
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
    // console.log('22112', points)

    return points;
  }

  getOffersAll() {
    return this._offers;
  }

  getDestinationsAll() {
    return  this._destinations;
  }

  getPointsAll() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
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


