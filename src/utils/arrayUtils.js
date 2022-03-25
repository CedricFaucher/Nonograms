export const getMaxLengthOfArrayInArray = array => {
  let max = 0;

  array.forEach(arr => {
    if (arr.length > max) {
      max = arr.length;
    }
  });

  return max;
};