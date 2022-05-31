import {AbstractView} from './abstract.js';
import { FilterType } from '../utils/const.js';

const createListEmptyTemplate = (isEmpty, filterBlock, filterType) => {
  if (isEmpty) {
    if (filterBlock[FilterType.PAST] === filterType) {
      return '<p class="trip-events__msg">There are no past events now</p>';
    }
    if (filterBlock[FilterType.FUTURE] === filterType) {
      return '<p class="trip-events__msg">There are no future events now</p>';
    }
    return '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
  return '';
};

export default class ListEmptyView extends AbstractView {
  #isEmpty = null;
  #filterBlock = null;
  #filterType = null;
  constructor(isEmpty, filterBlock, filterType) {
    super();
    this.#isEmpty = isEmpty;
    this.#filterBlock = filterBlock;
    this.#filterType = filterType;
  }

  getTemplate() {
    return createListEmptyTemplate(this.#isEmpty, this.#filterBlock, this.#filterType);
  }
}

