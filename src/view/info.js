import { getCumulativeDate } from "../utils/dayjs.js";
import { AbstractView } from "./abstract.js";

const createInfoTemplate = (points) => {
  //маршрут (все города)
  const mainTitle = points.length === 0 ?
    "" : points.length === 3 ?
      points.map((currentPoint) => { return `${currentPoint.destination.name}` }).join(` &mdash; `) :
      `${points[0].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}`;

  //даты от и до
  const cumulativeDate = points.length === 0 ? '' : getCumulativeDate(points[0].dateFrom, points[points.length - 1].dateTo);

  //общая стоимость
  let fullCost = 0;
  fullCost = points.length === 0 ?
    0 : points.reduce((sum, current) => {
      return sum + current.basePrice +
        (current.offers === undefined ?
          0 :
          current.offers.reduce((sumOffers, currentOffer) => {
              return sumOffers + currentOffer.price;
          }, 0));

    }, 0);


  return ` <section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${mainTitle}</h1>

    <p class="trip-info__dates">${cumulativeDate}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${fullCost}</span>
  </p>
</section>`;
}

export default class InfoView extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }
  getTemplate() {
    return createInfoTemplate(this._points);
  }
}


