import FilterView from '../view/filter-view.js';
import {render, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType, RenderPosition} from '../utils/const.js';



export default class FilterPresenter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._filtersView = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterView = this._filtersView;
    this._filtersView = new FilterView(filters, this._filterModel.getActiveFilter());
    this._filtersView.setFilterChangeHandler(this._handleFilterTypeChange);
    if (prevFilterView === null) {
      render(this._filterContainer, this._filtersView, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filtersView, prevFilterView);
    remove(prevFilterView);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getActiveFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
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
}
