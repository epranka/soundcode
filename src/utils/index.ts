export const mapRange = (
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) => {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const mapPower2 = (
  x: number,
  in_min: number,
  in_max: number,
  out_minp2: number,
  out_maxp2: number
) => {
  const min_degree = Math.log2(out_minp2);
  const max_degree = Math.log2(out_maxp2);
  let degree = mapRange(x, in_min, in_max, min_degree, max_degree);
  degree = Math.round(degree);
  return Math.pow(2, degree);
};

export const getKeysWithHighestValue = (o, n) => {
  var keys = Object.keys(o);
  keys.sort(function(a, b) {
    return o[b] - o[a];
  });
  return keys.slice(0, n);
};

export const sumOfP2 = (x: number) => {
  const result: number[] = [];
  let divider = 1;
  while (x !== 0) {
    if (x >= divider) {
      x = x % divider;
      if (x === 0) {
        result.push(divider);
      } else {
        result.push(divider);
      }
    }
    divider = divider / 2;
  }
  return result;
};
