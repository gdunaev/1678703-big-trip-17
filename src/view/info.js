import { getCumulativeDate } from '../utils/dayjs.js';
import { AbstractView } from './abstract.js';

const getMainTitle = (points) => {
  if(points.length === 0) {
    return '';
  }
  if(points.length === 3) {
    return points.map((currentPoint) => `${currentPoint.destination.name}`).join(' &mdash; ');
  }
  return `${points[0].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}`;
};

const createInfoTemplate = (points, offersAll) => {

  //маршрут (все города)
  const mainTitle = getMainTitle(points);

  //даты от и до
  const cumulativeDate = points.length === 0 ? '' : getCumulativeDate(points[0].dateFrom, points[points.length - 1].dateTo);

  //общая стоимость
  let fullCost = 0;
  fullCost = points.length === 0 ?
    0 : points.reduce((sum, current) => sum + current.basePrice +
        (current.offers === undefined ?
          0 :
          current.offers.reduce((sumOffers, currentOffer) => {
            const type = current.typePoint;

            //поиск офферов по типу и суммирование цен у тех, чьи id указаны в точке
            const offersType = offersAll.find((elem) => elem.type === type).offers;
            const price = offersType.find((elem) => elem.id === currentOffer).price;
            return sumOffers + price;
          }, 0)), 0);


  return ` <section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${mainTitle}</h1>

    <p class="trip-info__dates">${cumulativeDate}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${fullCost}</span>
  </p>
</section>`;
};

export default class InfoView extends AbstractView {
  constructor(points, offersAll) {
    super();
    this._points = points;
    this._offers = offersAll;
  }

  getTemplate() {
    return createInfoTemplate(this._points, this._offers);
  }
}


