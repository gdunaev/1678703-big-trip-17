import ListEmptyView from '../view/list-empty.js';
import { render, remove } from '../utils/render.js';
import InfoView from '../view/info.js';
import PointPresenter, {State as PresenterViewState} from './point-presenter.js';
import SortView from '../view/sort-view.js';
import { UpdateType, UserAction, FilterType, RenderPosition, SortMode } from '../utils/const.js';
import PointNewPresenter from './point-new-presenter.js';
import LoadingView from '../view/loading.js';


export default class TripPresenter {

  #tripEventsMain = null;
  #isEmpty = true;
  #listEmptyView = new ListEmptyView(this.#isEmpty);
  #infoPoints = null;
  #pointPresenter = {};
  #sortMode = SortMode.DAY;
  #pointsModel = null;
  #filterModel = null;
  #api = null;
  #sortView = null;
  #isLoading = true;
  #newEventElement = document.querySelector('.trip-main__event-add-btn');
  #loadingComponent = new LoadingView(this.#isLoading);
  #pointNewPresenter = null;
  #offers = [];
  #destinations = [];

  constructor(tripEventsMain, pointsModel, filterModel, api) {
    this.#tripEventsMain = tripEventsMain;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#api = api;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointNewPresenter = new PointNewPresenter(this.#handleViewAction);
  }

  start() {
    this.#renderPoints();
  }

  //при нажатии на кнопку "Добавить новую (New event)"
  createPoint() {
    this.#sortMode = SortMode.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#pointNewPresenter.start(this.#offers, this.#destinations);
  }


  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE:
        this.#pointPresenter[update.id].setViewState(PresenterViewState.SAVING);
        this.#api.updatePoint(update).then((response) => {
          this.#pointsModel.updatePoint(updateType, response);
        }).catch(() => {
          this.#pointPresenter[update.id].setViewState(PresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD:
        this.#pointNewPresenter.setSaving();
        this.#api.addPoint(update).then((response) => {
          this.#pointsModel.addPoint(updateType, response);
        }).catch(() => {
          this.#pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE:
        this.#pointPresenter[update.id].setViewState(PresenterViewState.DELETING);
        this.#api.deletePoint(update).then(() => {
          this.#pointsModel.deletePoint(updateType, update);
        }).catch(() => {
          this.#pointPresenter[update.id].setViewState(PresenterViewState.ABORTING);
        });
        break;
    }
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter[point.id].start(point);
        break;
      case UpdateType.MINOR:
        this.#clearAllPoints();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearAllPoints({resetSortType: true});
        this.#renderPoints();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPoints();
        break;
    }
  };

  #renderLoading = () => {
    const tripEvent = document.querySelector('.trip-events');
    render(tripEvent, this.#loadingComponent, RenderPosition.BEFOREEND);
    this.#newEventElement.disabled = true;
  };

  #clearAllPoints = ({ resetSortType = false } = {}) => {
    this.#pointNewPresenter.destroy();
    Object.values(this.#pointPresenter).forEach((presenter) => presenter.destroy());
    this.#pointPresenter = {};

    remove(this.#sortView);
    remove(this.#loadingComponent);
    remove(this.#infoPoints);

    if (resetSortType) {
      this.#sortMode = SortMode.DAY;
    }
  };

  #handleSortModeChange = (sortMode) => {
    if (this.#sortMode === sortMode) {
      return;
    }
    this.#sortMode = sortMode;

    this.#clearAllPoints();
    this.#renderPoints();
  };

  #changeModePoint = () => {
    this.#pointNewPresenter.destroy(); //закрывает открытую форму новой точки
    Object.values(this.#pointPresenter).forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripEventsMain, this.#changeModePoint, this.#handleViewAction, this.#offers, this.#destinations);
    pointPresenter.start(point);
    this.#pointPresenter[point.id] = pointPresenter;
  };

  //отрисовка Инфо, Загрузки, Сортировки и Списка точек
  #renderPoints = () => {

    //при загрузке показываем заставку загрузки
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const filterType = this.#filterModel.getActiveFilter();
    const points = this.#pointsModel.getPoints(filterType, this.#sortMode);
    this.#offers = this.#pointsModel.getOffersAll();
    this.#destinations = this.#pointsModel.getDestinationsAll();

    //отрисовка InfoView (список точек и общая стоимость)
    const tripMain = document.querySelector('.trip-main');
    this.#infoPoints = new InfoView(points, this.#offers);
    render(tripMain, this.#infoPoints, RenderPosition.AFTERBEGIN);

    this.#newEventElement.disabled = false;

    //если точек нет - прячем InfoView и показываем заставку
    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    //отрисовываем сортировку
    this.#renderSort();

    //отрисовываем точки
    points.forEach((point) => this.#renderPoint(point));
  };

  //показываем заставку при пустом списке
  #renderNoPoints = () => {
    const tripInfoMain = document.querySelector('.trip-main__trip-info');
    tripInfoMain.style.display = 'none';
    render(this.#tripEventsMain, this.#listEmptyView, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    if (this.#sortView !== null) {
      this.#sortView = null;
    }

    this.#sortView = new SortView(this.#sortMode);
    this.#sortView.setSortModeChangeHandler(this.#handleSortModeChange);

    render(this.#tripEventsMain, this.#sortView, RenderPosition.BEFOREEND);
  };
}
