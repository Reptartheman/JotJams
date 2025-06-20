import { initialDataFetch, dataFromMasterReleaseURL } from "./api";

import {
  getMasterUrl,
  getImages,
  getPrimaryData,
  getAllOtherUrls,
} from "./data";

import { renderInitialDisplay, domElements, renderVersions, handleFavorites } from "./dom";
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
  currentLinks = getAllOtherUrls(mainData);
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
  renderVersions(initialData)
  return display;
};

domElements.searchButton.addEventListener("click", displayInitialSearch);
domElements.seeFavs.addEventListener("click", () => {
  window.location.href = "favs.html";
});

//domElements.addToFavs.addEventListener("click", handleFavorites);



/* 
NEXT TIME:

- sort and favorite functions
*/


