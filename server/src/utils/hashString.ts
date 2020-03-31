/* eslint-disable no-bitwise */
const hashString = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash += (string.charCodeAt(i) * 31) ** (string.length - i);
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
};

export default hashString;
