import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getSumAndTypes, getTypesCount, getTime } from '../utils/statistics-utils.js';
import { getTypeDuration } from '../utils/dayjs.js';

const BAR_HEIGHT = 55;
const ConstantChart = {
  BAR: 'horizontalBar',
  DATA_COLOR: '#ffffff',
  ANCHOR_SET: 'start',
  ANCHOR_LABEL: 'end',
  COLOR: '#000000',
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  ALIGN: 'start',
  TITLE_POSITION: 'left',
  DATA_SIZE: 13,
  TICK_SIZE: 13,
  TITLE_SIZE: 23,
  COEFFICIENT: 5,
  PADDING: 5,
  TEXT_MONEY: 'MONEY',
  TEXT_TYPE: 'TYPE',
  TEXT_TIME: 'TYPE',
};

const createStatisticsTemplate = () => `<section class="statistics">
            <h2>Trip statistics</h2>

            <!-- Пример диаграмм -->
            <!--<img src="img/big-trip-stats-markup.png" alt="Пример диаграмм">-->

            <div class="statistics__item money">
              <canvas class="statistics__chart statistics__chart--money" id="money" width="900"></canvas>
            </div>

            <div class="statistics__item">
              <canvas class="statistics__chart statistics__chart--transport" id="type" width="900"></canvas>
            </div>

            <div class="statistics__item">
              <canvas class="statistics__chart statistics__chart--time" id="time" width="900"></canvas>
            </div>
          </section>`;

const renderMoneyChart = (moneyCtx, points) => {
  const {sum, types} = getSumAndTypes(points);
  moneyCtx.height = BAR_HEIGHT * ConstantChart.COEFFICIENT;
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: ConstantChart.BAR,
    data: {
      labels: types,
      datasets: [{
        data: sum,
        backgroundColor: ConstantChart.DATA_COLOR,
        hoverBackgroundColor: ConstantChart.DATA_COLOR,
        anchor: ConstantChart.ANCHOR_SET,
        barThickness: ConstantChart.BAR_THICKNESS,
        minBarLength: ConstantChart.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ConstantChart.DATA_SIZE,
          },
          color: ConstantChart.COLOR,
          anchor: ConstantChart.ANCHOR_LABEL,
          align: ConstantChart.ALIGN,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: ConstantChart.TEXT_MONEY,
        fontColor: ConstantChart.COLOR,
        fontSize: ConstantChart.TITLE_SIZE,
        position: ConstantChart.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ConstantChart.COLOR,
            padding: ConstantChart.PADDING,
            fontSize: ConstantChart.TICK_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, points) => {
  typeCtx.height = BAR_HEIGHT * ConstantChart.COEFFICIENT;
  const {count, types} = getTypesCount(points);
  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: ConstantChart.BAR,
    data: {
      labels: types,
      datasets: [{
        data: count,
        backgroundColor: ConstantChart.DATA_COLOR,
        hoverBackgroundColor: ConstantChart.DATA_COLOR,
        anchor: ConstantChart.ANCHOR_SET,
        barThickness: ConstantChart.BAR_THICKNESS,
        minBarLength: ConstantChart.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ConstantChart.DATA_SIZE,
          },
          color: ConstantChart.COLOR,
          anchor: ConstantChart.ANCHOR_LABEL,
          align: ConstantChart.ALIGN,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: ConstantChart.TEXT_TYPE,
        fontColor: ConstantChart.COLOR,
        fontSize: ConstantChart.TITLE_SIZE,
        position: ConstantChart.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ConstantChart.COLOR,
            padding: ConstantChart.PADDING,
            fontSize: ConstantChart.TICK_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, points) => {
  timeCtx.height = BAR_HEIGHT * ConstantChart.COEFFICIENT;
  const {time, types} = getTime(points);
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: ConstantChart.BAR,
    data: {
      labels: types,
      datasets: [{
        data: time,
        backgroundColor: ConstantChart.DATA_COLOR,
        hoverBackgroundColor: ConstantChart.DATA_COLOR,
        anchor: ConstantChart.ANCHOR_SET,
        barThickness: ConstantChart.BAR_THICKNESS,
        minBarLength: ConstantChart.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ConstantChart.DATA_SIZE,
          },
          color: ConstantChart.COLOR,
          anchor: ConstantChart.ANCHOR_LABEL,
          align: ConstantChart.ALIGN,
          formatter: (val) => `${getTypeDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: ConstantChart.TEXT_TIME,
        fontColor: ConstantChart.COLOR,
        fontSize: ConstantChart.TITLE_SIZE,
        position: ConstantChart.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ConstantChart.COLOR,
            padding: ConstantChart.PADDING,
            fontSize: ConstantChart.TICK_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


export default class StatisticsView extends SmartView {
  constructor(points) {
    super();
    this._points = points;
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  start() {
    const moneyCtx = document.querySelector('.statistics__chart--money');
    const typeCtx = document.querySelector('.statistics__chart--transport');
    const timeCtx = document.querySelector('.statistics__chart--time');

    renderMoneyChart(moneyCtx, this._points);
    renderTypeChart(typeCtx, this._points);
    renderTimeChart(timeCtx, this._points);

    this.show();
  }
}
