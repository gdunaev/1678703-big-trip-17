import {AbstractView} from './abstract.js';
import {MenuItem} from '../utils/const.js';

const createNavigationTemplate = () => `<nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn trip-tabs__btn--active" value=${MenuItem.TABLE} href="#">${MenuItem.TABLE}</a>
              <a class="trip-tabs__btn" value=${MenuItem.STATS} href="#">${MenuItem.STATS}</a>
            </nav>`;


export default class SiteMenuView extends AbstractView {
  #currentMenuItem = null;
  constructor(currentMenuItem) {
    super();
    this.#currentMenuItem = currentMenuItem;
  }

  getTemplate() {
    return createNavigationTemplate(this.#currentMenuItem);
  }

  #menuClickHandler = (evt) => {
    const menuItem = MenuItem[evt.target.textContent.toUpperCase()];
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    items.forEach((element) => {element.className = (element.textContent === menuItem) ? 'trip-tabs__btn trip-tabs__btn--active' : 'trip-tabs__btn';});

    evt.preventDefault();
    this._callback.menuClick(menuItem);
  };

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this.#menuClickHandler);
  }
}


