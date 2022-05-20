import Observer from '../utils/observer.js';

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

  getOffersAll() {
    return this._offers;
  }

  getOffers(type) {
    return  this._offers.find((offer) => {
      offer.type === type;
    });
  }

  getDestinationsAll() {
    return  this._destinations;
  }

  getPoints() {
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
    let adaptedPoint = Object.assign(
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


