import {AbstractView} from './abstract.js';

const createListEmptyTemplate = (isEmpty) => {
  if (isEmpty) {
    return '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
  return '';
};

export default class ListEmptyView extends AbstractView {
  constructor(isEmpty) {
    super();
    this._isEmpty = isEmpty;
  }

  getTemplate() {
    return createListEmptyTemplate(this._isEmpty);
  }
}

