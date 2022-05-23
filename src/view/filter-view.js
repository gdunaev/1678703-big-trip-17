import { AbstractView } from './abstract.js';
import { FilterType } from '../utils/const.js';

const createFilterItemTemplate = (filter, currentFilterType, length) => {
  const {type, name} = filter;
  console.log('11', type)
  return `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value=${name}  ${(type === currentFilterType) ? 'checked' : ''} ${type === 'past' ? 'disabled' : ''}>
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
  constructor(filters, currentFilterType, length) {
    super();
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._filter = null;
    this._currentFilter = currentFilterType;
    this._filters = filters;
    this._length = length;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter, this._length);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._filter = FilterType[evt.target.value.toUpperCase()];
    this._callback.filterChange(this._filter);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
