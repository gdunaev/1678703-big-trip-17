import {AbstractView} from './abstract';

export default class SmartView extends AbstractView {

  #state = {};

  constructor() {
    super();
  }

  //перерисовывает компонент на странице, с новыми данными
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    this.#state = Object.assign(
      {},
      this.#state,
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

