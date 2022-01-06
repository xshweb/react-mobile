export const gotDay = function () {
  let res = [];
  for (let i = 0; i <= 30; i++) {
    let data = {
      date: `12/${fillZero(i)}`,
      value: gotRandom(300),
    };
    res.push(data);
  }
  return res;
};

export const gotMonth = function () {
  let res = [];
  for (let i = 1; i <= 12; i++) {
    let data = {
      date: fillDate(i),
      value: gotRandom(300),
    };
    res.push(data);
  }
  return res;
};

function fillDate(value) {
  return `2021/${fillZero(value)}`
}

function fillZero(num) {
  return num < 10 ? "0" + num : num + "";
}

function gotRandom(base) {
  const value = Math.random() * 100;
  return value > 50 ? parseInt(base + value) : parseInt(base - value);
}
