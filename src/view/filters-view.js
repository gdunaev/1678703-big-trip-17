import { AbstractView } from './abstract-view.js';
import { FilterType } from '../utils/const.js';

const createFilterItemTemplate = (filter, currentFilterType, filtersBlock) => {
  const {type, name} = filter;
  return `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value=${name}  ${(type === currentFilterType) ? 'checked' : ''} ${filtersBlock[type] && FilterType.EVERYTHING !== type ? 'disabled' : ''}>
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
</div>`;
};

const createFiltersTemplate = (filterItems, currentFilterType, length) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, length))
    .join('');
  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};


export default class FiltersView extends AbstractView {

  #filters = null;
  #filtersBlock = null;
  #currentFilter = null;

  constructor(filters, currentFilterType, filtersBlock) {
    super();
    this.#currentFilter = currentFilterType;
    this.#filters = filters;
    this.#filtersBlock = filtersBlock;
  }

  getTemplate() {
    return createFiltersTemplate(this.#filters, this.#currentFilter, this.#filtersBlock);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const filter = FilterType[evt.target.value.toUpperCase()];
    this._callback.filterChange(filter);
  };

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.getElement().addEventListener('click', this.#filterTypeChangeHandler);
  }
}
