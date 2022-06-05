import {compareDataFrom, compareTime} from './dayjs.js';

//проверить нажата ли клавиша Escape или Esc
const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const comparePrice = (elementA, elementB) => {
  const rankA = +elementA.basePrice;
  const rankB = +elementB.basePrice;
  return rankB - rankA;
};

const getSortPricePoints = (points) => points.slice().sort(comparePrice);

const getSortDayPoints = (points) => points.slice().sort(compareDataFrom);

const getSortTimePoints = (points) => points.slice().sort(compareTime);

const copy = (obj) => {
  const copyProps = (clone) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = copy(obj[key]);
      }
    }
  };

  // Создание иммутабельной копии объекта
  const cloneObj = () => {
    const clone = {};
    copyProps(clone);
    return clone;
  };

  // Создание иммутабельной копии массива
  const cloneArr =() => obj.map((item) => copy(item));

  //  Создание иммутабельной копии Map
  const cloneMap =() => {
    const clone = new Map();
    for (const [key, val] of obj) {
      clone.set(key, copy(val));
    }
    return clone;
  };

  //  Создание иммутабельной копии Set
  const cloneSet =()=> {
    const clone = new Set();
    for (const item of obj) {
      clone.add(copy(item));
    }
    return clone;
  };

  // Создание иммутабельной копии функции
  const cloneFunction =() => {
    const clone = obj.bind(this);
    copyProps(clone);
    return clone;
  };

  // Получение типа объекта
  const type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

  // Возвращаем копию в зависимости от типа исходных данных
  if (type === 'object') {return cloneObj();}
  if (type === 'array') {return cloneArr();}
  if (type === 'map') {return cloneMap();}
  if (type === 'set') {return cloneSet();}
  if (type === 'function') {return cloneFunction();}

  return obj;
};


export { isEscEvent, getSortPricePoints, getSortTimePoints, getSortDayPoints, copy };
