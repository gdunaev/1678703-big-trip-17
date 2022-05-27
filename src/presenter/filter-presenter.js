import FilterView from '../view/filter-view.js';
import { render, replace, remove } from '../utils/render.js';
import { FilterType, UpdateType, RenderPosition } from '../utils/const.js';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filtersView = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filtersView = null;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const filters = this.#getFilters();
    const prevFilterView = this.#filtersView;
    const filterType = this.#filterModel.getActiveFilter();
    const filtersBlock = this.#pointsModel.getFiltersBlock();

    this.#filtersView = new FilterView(filters, filterType, filtersBlock);
    this.#filtersView.setFilterChangeHandler(this.#handleFilterTypeChange);
    if (prevFilterView === null) {
      render(this.#filterContainer, this.#filtersView, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filtersView, prevFilterView);
    remove(prevFilterView);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.getActiveFilter() === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #getFilters = () => [
    {
      type: FilterType.EVERYTHING,
      name: 'Everything',
    },
    {
      type: FilterType.FUTURE,
      name: 'Future',
    },
    {
      type: FilterType.PAST,
      name: 'Past',
    },
  ];
}
