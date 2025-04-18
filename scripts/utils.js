export const returnPromises = (...promises) => Promise.all(promises);

export const shortenProfileDescription = (text, limit = 245) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

export const createElementUtil = (elem) => document.createElement(elem);

export const addIdsToElements = (array) =>
  array.forEach(
    (element) => (window[element] = document.getElementById(element))
  );
