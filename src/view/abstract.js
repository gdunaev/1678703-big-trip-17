import { createElementDom } from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 1600;


class AbstractView {
    constructor() {
        if (new.target === AbstractView) {
            throw new Error('Can not instantiate AbstractView, only concrete one.');
        }
        this._element = null;
       this._callback = {};
    }

    getTemplate() {
        throw new Error('AbstractView metod not implemented: getTemplate');
    }

    getElement() {
        if (!this._element) {
            this._element = createElementDom(this.getTemplate());
        }
        return this._element;
    }

    removeElement() {
        this._element = null;
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
        this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
        setTimeout(() => {
          this.getElement().style.animation = '';
          callback();
        }, SHAKE_ANIMATION_TIMEOUT);
      }
}

 export {AbstractView}
