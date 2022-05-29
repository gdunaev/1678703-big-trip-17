import {AbstractView} from './abstract.js';

const createListEmptyTemplate = (isEmpty) => {
  if (isEmpty) {
    return '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
  return '';
};

export default class ListEmptyView extends AbstractView {
  #isEmpty = null;
  constructor(isEmpty) {
    super();
    this.#isEmpty = isEmpty;
  }

  getTemplate() {
    return createListEmptyTemplate(this.#isEmpty);
  }
}

