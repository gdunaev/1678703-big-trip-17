import ListEmptyView from '../view/list-empty.js';
import { render, remove } from '../utils/render.js';
import InfoView from '../view/info.js';
import PointPresenter, {State as PresenterViewState} from './point-presenter.js';
import SortView from '../view/sort-view.js';
import { UpdateType, UserAction, FilterType, RenderPosition, SortMode } from '../utils/const.js';
import PointNewPresenter from './point-new-presenter.js';
import LoadingView from '../view/loading.js';


export default class TripPresenter {
  constructor(tripEventsMain, pointsModel, filterModel, api) {
    this._isEmpty = true;
    this._listEmptyView = new ListEmptyView(this._isEmpty);
    this._infoPoints = null;
    this._tripEventsMain = tripEventsMain;
    this._pointPresenter = {};
    this._changeModePoint = this._changeModePoint.bind(this);
    this._filterType = null;
    this._sortMode = SortMode.DAY;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._sortView = null;
    this._handleSortModeChange = this._handleSortModeChange.bind(this);
    this._pointNewPresenter = new PointNewPresenter(this._handleViewAction);
    this._isLoading = true;
    this._loadingComponent = new LoadingView(this._isLoading);
    this._api = api;
    this._newEventElement = document.querySelector('.trip-main__event-add-btn');
    this._offers = [];
    this._destinations = [];
    this._points = [];
  }

  start() {
    this._renderPoints();
  }

  //при нажатии на кнопку "Добавить новую (New event)"
  createPoint() {
    this._sortMode = SortMode.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this._pointNewPresenter.start(this._points, this._offers, this._destinations);
  }


  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE:
        this._pointPresenter[update.id].setViewState(PresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        }).catch(() => {
          this._pointPresenter[update.id].setViewState(PresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        }).catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE:
        this._pointPresenter[update.id].setViewState(PresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        }).catch(() => {
          this._pointPresenter[update.id].setViewState(PresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, point) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[point.id].start(point);
        break;
      case UpdateType.MINOR:
        this._clearAllPoints();
        this._renderPoints();
        break;
      case UpdateType.MAJOR:
        this._clearAllPoints({resetSortType: true});
        this._renderPoints();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderPoints();
        break;
    }
  }

  _renderLoading() {
    const tripEvent = document.querySelector('.trip-events');
    render(tripEvent, this._loadingComponent, RenderPosition.BEFOREEND);
    this._newEventElement.disabled = true;
  }

  _clearAllPoints({ resetSortType = false } = {}) {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortView);
    remove(this._loadingComponent);
    remove(this._infoPoints);

    if (resetSortType) {
      this._sortMode = SortMode.DAY;
    }
  }

  _handleSortModeChange(sortMode) {
    if (this._sortMode === sortMode) {
      return;
    }
    this._sortMode = sortMode;

    this._clearAllPoints();
    this._renderPoints();
  }

  _changeModePoint() {
    this._pointNewPresenter.destroy(); //закрывает открытую форму новой точки
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripEventsMain, this._changeModePoint, this._handleViewAction, this._offers, this._destinations);
    pointPresenter.start(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  //отрисовка Инфо, Загрузки, Сортировки и Списка точек
  _renderPoints() {

    //при загрузке показываем заставку загрузки
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const filterType = this._filterModel.getActiveFilter();
    // console.log('111', filterType)
    const points = this._pointsModel.getPoints(filterType);
    // console.log('222', points)
    this._offers = this._pointsModel.getOffersAll();
    this._destinations = this._pointsModel.getDestinationsAll();

    //отрисовка InfoView (список точек и общая стоимость)
    const tripMain = document.querySelector('.trip-main');
    this._infoPoints = new InfoView(points, this._offers);
    render(tripMain, this._infoPoints, RenderPosition.AFTERBEGIN);

    this._newEventElement.disabled = false;

    //если точек нет - прячем InfoView и показываем заставку
    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    //отрисовываем сортировку
    this._renderSort();

    //отрисовываем точки
    points.forEach((point) => this._renderPoint(point));
  }

  //показываем заставку при пустом списке
  _renderNoPoints() {
    const tripInfoMain = document.querySelector('.trip-main__trip-info');
    tripInfoMain.style.display = 'none';
    render(this._tripEventsMain, this._listEmptyView, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortView !== null) {
      this._sortView = null;
    }

    this._sortView = new SortView(this._sortMode);
    this._sortView.setSortModeChangeHandler(this._handleSortModeChange);

    render(this._tripEventsMain, this._sortView, RenderPosition.BEFOREEND);
  }
}
