import {compareDataFrom, compareTime} from './dayjs.js'


const getRandomInteger = (a = 0, b = 1) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));
    return Math.floor(lower + Math.random() * (upper - lower + 1));
}

//проверить нажата ли клавиша Escape или Esc
const isEscEvent = (evt) => {
    return evt.key === 'Escape' || evt.key === 'Esc';
}

const comparePrice = (elementA, elementB) => {
    const rankA = +elementA.basePrice;
    const rankB = +elementB.basePrice;
    return rankB - rankA;
};

const getSortPricePoints = (points) => {
    const sortPoints = points.slice().sort(comparePrice);
    return sortPoints;
}

const getSortDayPoints = (points) => {
    const sortPoints = points.slice().sort(compareDataFrom);
    return sortPoints;
}

const getSortTimePoints = (points) => {
    const sortPoints = points.slice().sort(compareTime);
    return sortPoints;
}

export { getRandomInteger, isEscEvent, getSortPricePoints, getSortTimePoints, getSortDayPoints }
