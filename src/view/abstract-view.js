import { createElementDom } from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 1600;
const QUANTITY_MILLISECONDS = 1000;


class AbstractView {

  #element = null;

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can not instantiate AbstractView, only concrete one.');
    }
    this._callback = {};
  }

  getTemplate() {
    throw new Error('AbstractView metod not implemented: getTemplate');
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElementDom(this.getTemplate());
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }

  show() {
    document.querySelector('.trip-filters').classList.add('visually-hidden');
    document.querySelector('.trip-events').classList.add('trip-events--hidden');
    document.querySelector('.trip-main__event-add-btn').disabled = true;
  }

  hide() {
    document.querySelector('.trip-events').classList.remove('trip-events--hidden');
    document.querySelector('.trip-filters').classList.remove('visually-hidden');
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / QUANTITY_MILLISECONDS}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export {AbstractView};
