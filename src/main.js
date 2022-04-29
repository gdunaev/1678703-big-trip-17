import TripPresenter from "./presenter/trip-presenter.js";
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {MenuItem, RenderPosition, UpdateType} from './utils/const.js';
import { render, remove } from "./utils/render.js";
import SiteMenuView from "./view/site-menu-view.js";
import StatisticsView from './view/statistics-view.js';
import Api from './utils/api.js';

const AUTHORIZATION = 'Basic 1qAWDr5tGY7uJi9';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const pageBodyMain = document.querySelector('.page-body__page-main');
const tripEventsMain = pageBodyMain.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const pageBodyContainer = pageBodyMain.querySelector('.page-body__container');
const tripMain = document.querySelector('.trip-main');
const api = new Api(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenuView(MenuItem.TABLE);
let statisticsComponent = null;
const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);
const presenter = new TripPresenter(tripEventsMain, pointsModel, filterModel, api);
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');


render(tripMain, siteMenuComponent, RenderPosition.BEFOREEND);

render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);

const handleSiteMenuClick = (menuItem) => {

  if(statisticsComponent !== null) {
    statisticsComponent.hide();
    remove(statisticsComponent);
    statisticsComponent = null;
  }

  switch (menuItem) {
    case MenuItem.TABLE:
      break;
    case MenuItem.STATS:
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
      statisticsComponent.start();
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

//первоначальная отрисовка фильтров
filterPresenter.init();

//выводит список точек (пустой)
presenter.start();

//обработчик создания новой точки - New Event
document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    presenter.createPoint();
  });


//загрузка точек с сервера
api.getAll().then((value) => {
  pointsModel.setPoints(UpdateType.INIT, value);
}).catch(() => {
  //  pointsModel.setPoints(UpdateType.INIT, [[], [], []]);
});

//ДОДЕЛАТЬ: при отправке нового оффера установить в addPoint points1, вызывать ошибку и переделать расчет офферов,
//некорректно работает когда все снимаешь, он их заново добавляет.
//И сделать отправку обновленной точки.
