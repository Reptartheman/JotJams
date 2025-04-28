export const returnPromises = (...promises) => Promise.all(promises);

export const shortenProfileDescription = (text, limit = 245) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

export const createElementUtil = (elem) => document.createElement(elem);

export const addIdsToElements = (array) => 
  array.reduce((elements, id) => {
    const el = document.getElementById(id);
    if (el) {
      elements[id] = el;
    }
    return elements;
  }, {});


export const resetContainers = (...containers) => {
  containers.forEach((element) => {
    element.textContent = "";
  });
};


export const getUserInput = (input) => input.value.trim();


