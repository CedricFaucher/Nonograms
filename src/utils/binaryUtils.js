export const convertBinaryStringToInteger = binaryString => {
  const length = binaryString.length;
  let result = 0;

  for (var i = 0; i < length; i++) {
    if("1" === binaryString.charAt(i)) {
      result += Math.pow(2, length - 1 - i);
    }
  }

  return result;
};