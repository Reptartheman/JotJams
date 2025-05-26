import { initialDataFetch, dataFromMasterReleaseURL } from "./api";

import {
  getMasterUrl,
  getImages,
  getPrimaryData,
  getSecondaryData,
  getAllOtherUrls,
  getMoreInfo,
} from "./data";

import { renderInitialDisplay, displaySecondaryData, addToFavorites, domElements } from "./dom";
import { getUserInput } from "./utils";

let currentLinks = null;

const displayInitialSearch = async (e) => {
  e.preventDefault();
  const input = getUserInput(searchInput);
  const initialData = await initialDataFetch(input);
  const masterUrl = getMasterUrl(initialData);
  const imageSources = getImages(initialData);
  const mainData = await dataFromMasterReleaseURL(masterUrl);
  const primary = getPrimaryData(mainData);
  const secondary = getSecondaryData(mainData);
  currentLinks = getAllOtherUrls(mainData);
  console.log(secondary);
  const display = renderInitialDisplay(input, {
    ...primary,
    coverImage: imageSources.coverImage,
  });
  domElements.seeMoreBtn.addEventListener("click", () => {
  if (currentLinks) {
    localStorage.setItem("seeMoreLinks", JSON.stringify(currentLinks));
    window.location.href = "more.html";
  }
});

  return display;
};

domElements.searchButton.addEventListener("click", displayInitialSearch);
domElements.seeFavs.addEventListener("click", () => {
  window.location.href = "favs.html";
});

domElements.addToFavs.addEventListener("click", addToFavorites);



/* 
NEXT TIME:

- sort and favorite functions
*/


