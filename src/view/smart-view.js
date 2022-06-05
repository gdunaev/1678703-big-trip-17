import {AbstractView} from './abstract-view.js';

export default class SmartView extends AbstractView {

  constructor() {
    super();
    this._state = {};
  }

  //перерисовывает компонент на странице, с новыми данными
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    this._state = Object.assign(
      {},
      this._state,
      update,
    );
    if (justDataUpdating) {
      return;
    }
    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}

