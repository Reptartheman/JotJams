import { initialDataFetch, dataFromMasterReleaseURL } from "./api";

import {
  getMasterUrl,
  getImages,
  getPrimaryData,
  getSecondaryData,
  getAllOtherUrls,
  getMoreInfo,
} from "./data";

import { renderInitialDisplay, displaySecondaryData, addToFavorites, loadFavorites } from "./dom";
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
  console.log(mainData);
  const display = renderInitialDisplay(input, {
    ...primary,
    coverImage: imageSources.coverImage,
  });
  trackListingBtn.addEventListener("click", () => {
    displaySecondaryData(secondary.trackData, secondary);
  });

  return display;
};

searchButton.addEventListener("click", displayInitialSearch);

moreInfoBtn.addEventListener("click", () => {
  if (currentLinks) {
    getMoreInfo(currentLinks.artistResourceUrl);
  }
});



//loadFavorites();
//addToFavs.addEventListener("click", addToFavorites);



/* 
NEXT TIME:

- sort and favorite functions
*/


