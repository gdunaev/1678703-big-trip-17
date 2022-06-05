import { AbstractView } from './abstract-view.js';
import { FilterType } from '../utils/const.js';

const createListEmptyTemplate = (filterBlock, filterType, isError) => {
  if (isError) {
    return '<p class="trip-events__msg">Could not get the points, try again...</p>';
  }
  if (filterBlock[FilterType.PAST] && FilterType.PAST === filterType) {
    return '<p class="trip-events__msg">There are no past events now</p>';
  }
  if (filterBlock[FilterType.FUTURE] && FilterType.FUTURE === filterType) {
    return '<p class="trip-events__msg">There are no future events now</p>';
  }
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};


export default class ListEmptyView extends AbstractView {
  #filterBlock = null;
  #filterType = null;
  #isError = false;

  constructor(filterBlock, filterType, isError) {
    super();
    this.#filterBlock = filterBlock;
    this.#filterType = filterType;
    this.#isError = isError;
  }

  getTemplate() {
    return createListEmptyTemplate(this.#filterBlock, this.#filterType, this.#isError);
  }
}

