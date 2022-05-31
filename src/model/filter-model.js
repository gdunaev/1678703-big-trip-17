import Observer from '../utils/observer.js';
import {FilterType} from '../utils/const.js';

export default class FilterModel extends Observer {
  #activeFilter = FilterType.EVERYTHING;
  constructor() {
    super();
  }

  setFilter(updateType, filter) {
    this.#activeFilter = filter;
    this._notify(updateType, filter);
  }

  getActiveFilter() {
    return this.#activeFilter;
  }
}
