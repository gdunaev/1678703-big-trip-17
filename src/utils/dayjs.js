import dayjs from 'dayjs';
import { getRandomInteger } from "./common.js";

const minMax = require('dayjs/plugin/minMax');
dayjs.extend(minMax);

const getStringDate = (partDate, symbol, isDay) => {
    if (partDate === 0) {
        return (isDay === true ? `00${symbol} ` : '');
    } else if (partDate < 10) {
        return `0${partDate}${symbol} `;
    } else if (partDate >= 10) {
        return `${partDate}${symbol} `;
    }
};

//расчет продолжительности поездки строкой - 00D 00H 00M
const getMinMaxDateDuration = (dateMin, dateMax) => {

    const dateFrom = dayjs(dateMin);
    const dateTo = dayjs(dateMax);

    //получим разницу в миллисекундах, и разделим на дни/часы/минуты
    const durationMinuteAll = Math.trunc(dateTo.diff(dateFrom) / 60000);
    const durationMin = durationMinuteAll % 60;
    const durationHourAll = (durationMinuteAll - durationMin) / 60;
    const durationHour = durationHourAll % 24;
    const durationDay = (durationHourAll - durationHour) / 24;

    const isDay = durationDay === 0 ? false : true;

    let durationPoint = getStringDate(durationMin, 'M', false);
    durationPoint = getStringDate(durationHour, 'H', isDay) + durationPoint;

    return getStringDate(durationDay, 'D', isDay) + durationPoint;
}

const getPointDurationMinute = (dateMin, dateMax) => {

    //получим разницу в миллисекундах, и посчитаем минуты
    return Math.trunc(dayjs(dateMax).diff(dayjs(dateMin)) / 60000);

}

//пребразуем кол-во минут в строку - 00D 00H 00M
const getTypeDuration = (minute) => {

    const durationMin = minute % 60;
    const durationHourAll = (minute - durationMin) / 60;
    const durationHour = durationHourAll % 24;
    const durationDay = (durationHourAll - durationHour) / 24;
    const isDay = durationDay === 0 ? false : true;

    let durationPoint = getStringDate(durationMin, 'M', false);
    durationPoint = getStringDate(durationHour, 'H', isDay) + durationPoint;
    durationPoint = getStringDate(durationDay, 'D', isDay) + durationPoint;
    return durationPoint;
}

const getRandomDate = () => {
    return dayjs(dayjs().add(getRandomInteger(-4320, 4320), 'minute').toDate());
}

const getDateHour = (date) => {
    return dayjs(date).format('HH:mm');
}

const getMonthDay = (date) => {
    return dayjs(date).format('MMM DD');
}

const getOnlyDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
}

const getDateHourMinute = (date) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

const getDateEdit = (date) => {
    return dayjs(date).format('DD/MM/YY HH:mm');
}

const getCumulativeDate = (dateMin, dateMax) => {

    const dateFrom = dayjs(dateMin);
    const dateTo = dayjs(dateMax);

    return dateFrom.format('MMM') === dateTo.format('MMM') ?
        `${dateFrom.format('MMM')} ${dateFrom.format('DD')}&nbsp;&mdash;&nbsp;${dateTo.format('DD')}` :
        `${dateFrom.format('MMM')} ${dateFrom.format('DD')}&nbsp;&mdash;&nbsp;${dateTo.format('MMM')} ${dateTo.format('DD')}`;

}

const getPastPoints = (points) => {

  //Past — список пройденных точек маршрута, т. е. точек у которых дата окончания маршрута меньше, чем текущая.
  //либо у которых дата начала меньше текущей даты, а дата окончания — больше
    const pastPoint = points.filter((currentPoint) => { return dayjs().isAfter(currentPoint.dateTo) ||
      (dayjs().isAfter(currentPoint.dateFrom) && dayjs().isBefore(currentPoint.dateTo))
     });
    return pastPoint;
}

const getFuturePoints = (points) => {

  //Future — список запланированных точек маршрута, т. е. точек, у которых дата начала события больше или равна текущей дате;
  //либо у которых дата начала меньше текущей даты, а дата окончания — больше
    const futurePoint = points.filter((currentPoint) => {
      return (dayjs().isBefore(currentPoint.dateFrom) || dayjs().isSame(currentPoint.dateFrom)) ||
      (dayjs().isAfter(currentPoint.dateFrom) && dayjs().isBefore(currentPoint.dateTo))
     });
    return futurePoint;
}

const compareDataFrom = (elementA, elementB) => {
    const rankA = dayjs(elementA.dateFrom);
    const rankB = dayjs(elementB.dateFrom);
    return rankA - rankB;
};

const compareDates = (elementA, elementB) => {
    let dateFrom = elementA.split("/").join(' ').split(' ');
    dateFrom = dayjs(`${'20' + dateFrom[2]}-${dateFrom[1]}-${dateFrom[0]} ${dateFrom[3]}`);
    let dateTo = elementB.split("/").join(' ').split(' ');
    dateTo = dayjs(`${'20' + dateTo[2]}-${dateTo[1]}-${dateTo[0]} ${dateTo[3]}`);
    return dateTo.diff(dateFrom);
};

const compareTime = (elementA, elementB) => {
    const rankA = dayjs(elementA.dateTo).diff(dayjs(elementA.dateFrom));
    const rankB = dayjs(elementB.dateTo).diff(dayjs(elementB.dateFrom));
    return rankB - rankA;
};



export {
    getDateHour,
    getMonthDay,
    getRandomDate,
    getOnlyDate,
    getDateHourMinute,
    getDateEdit,
    getCumulativeDate,
    getPastPoints,
    getFuturePoints,
    compareDataFrom,
    compareTime,
    compareDates,
    getPointDurationMinute,
    getTypeDuration,
    getMinMaxDateDuration
}
