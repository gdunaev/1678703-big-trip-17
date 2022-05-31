import PointModel from '../model/points-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {

  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  getAll() {
    return Promise
      .all([
        this.#getPoints(),
        this.#getDestinations(),
        this.#getOffers(),
      ])
      .then((value) => value);
  }

  #getPoints = () => this.#load({ url: 'points' })
    .then(Api.toJSON)
    .then((points) => points.map(PointModel.adaptToClient));

  #getDestinations = () => this.#load({ url: 'destinations' })
    .then(Api.toJSON)
    .then((destinations) => destinations);

  #getOffers = () => this.#load({ url: 'offers' })
    .then(Api.toJSON)
    .then((offers) => offers);

  updatePoint(point) {
    return this.#load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointModel.adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(PointModel.adaptToClient);
  }

  addPoint(point) {

    return this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointModel.adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(PointModel.adaptToClient);
  }

  deletePoint(point) {
    return this.#load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  #load = ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    return fetch(
      `${this.#endPoint}/${url}`,
      { method, body, headers },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  };

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
