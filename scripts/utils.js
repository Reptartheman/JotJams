export const returnPromises = (...promises) => Promise.all(promises);

export const shortenProfileDescription = (text, limit = 950) => {
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


export function splitInput(input) {
  const words = input.trim().split(' ');
  const songName = words.pop();
  const artistName = words.join(' ');
  return { artistName, songName };
}



