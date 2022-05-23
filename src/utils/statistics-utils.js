import { getPointDurationMinute } from './dayjs';

const getSumAndTypes = (points) => {

  //отбор в отдельный объект с суммированием цен по типу точки
  const sum = {};
  points.filter(({ typePoint, basePrice }) => {
    sum[typePoint] = sum[typePoint] + basePrice;
  });

  //сортировка по убыванию и создание объекта с готовыми для диаграммы массивами
  const sumTypesPoint = {
    types: [],
    sum: [],
  };
  Object.entries(sum).sort((a, b) => b[1] - a[1]).forEach((elem) => {
    sumTypesPoint.types.push(elem[0]);
    sumTypesPoint.sum.push(elem[1]);
  });

  return sumTypesPoint;
};

const getTypesCount = (points) => {

  //отбор в отдельный объект с суммированием количества точек
  const count = {};
  points.filter(({ typePoint }) => {
    count[typePoint] = count[typePoint] + 1;
  });

  //сортировка по убыванию и создание объекта с готовыми для диаграммы массивами
  const typesCount = {
    types: [],
    count: [],
  };
  Object.entries(count).sort((a, b) => b[1] - a[1]).forEach((elem) => {
    typesCount.types.push(elem[0]);
    typesCount.count.push(elem[1]);
  });

  return typesCount;
};

const getTime = (points) => {

  //отбор в отдельный объект с суммированием количества минут getPointDurationMinute
  const count = {};
  points.filter(({ typePoint, dateFrom, dateTo }) => {
    count[typePoint] = count[typePoint] + getPointDurationMinute(dateFrom, dateTo);
  });

  //сортировка по убыванию и создание объекта с готовыми для диаграммы массивами
  const typesTime = {
    types: [],
    time: [],
  };
  Object.entries(count).sort((a, b) => b[1] - a[1]).forEach((elem) => {
    typesTime.types.push(elem[0]);
    typesTime.time.push(elem[1]);
  });

  return typesTime;
};

export { getSumAndTypes, getTypesCount, getTime };

