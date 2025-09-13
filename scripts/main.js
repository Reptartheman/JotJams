import { initialDataFetch, dataFromMasterReleaseURL } from "./api";

import {
  getMasterUrl,
  getImages,
  getPrimaryData,
  getAllOtherUrls,
} from "./data";

import { renderYearCounters, renderInitialDisplay, domElements, renderVersions } from "./dom";
import { getUserInput } from "./utils";

let currentLinks = null;

const displayInitialSearch = async (e) => {
  e.preventDefault();
  const input = getUserInput(domElements.searchInput);

  localStorage.removeItem("lastSearchResults");
  localStorage.removeItem("lastSearchTerm");
  localStorage.removeItem("lastMasterURL");
  localStorage.removeItem("seeMoreLinks");

  const initialData = await initialDataFetch(input);
  const masterUrl = getMasterUrl(initialData);
  const imageSources = getImages(initialData);
  const mainData = await dataFromMasterReleaseURL(masterUrl);
  const primary = getPrimaryData(mainData);
  currentLinks = getAllOtherUrls(mainData);

  renderInitialDisplay({
    ...primary,
    coverImage: imageSources.coverImage,
  });

  renderVersions(initialData);

  renderYearCounters(initialData); 
  
  localStorage.setItem("lastSearchTerm", input);
  localStorage.setItem("lastSearchResults", JSON.stringify(initialData));
  localStorage.setItem("lastMasterURL", masterUrl);
  localStorage.setItem("seeMoreLinks", JSON.stringify(currentLinks));
};

const restoreLastSearch = () => {
  const savedResults = localStorage.getItem("lastSearchResults");
  if (!savedResults) return;

  const parsedResults = JSON.parse(savedResults);
  const imageSources = getImages(parsedResults);
  const dataToDisplay = {
    ...getPrimaryData(parsedResults[0]),
    coverImage: imageSources.coverImage,
  }

  renderInitialDisplay(dataToDisplay);

  renderVersions(parsedResults);

  const masterUrl = localStorage.getItem("lastMasterURL");
  if (masterUrl) {
    dataFromMasterReleaseURL(masterUrl).then(mainData => {
      currentLinks = getAllOtherUrls(mainData);
      localStorage.setItem("seeMoreLinks", JSON.stringify(currentLinks));
    });
  }

  setTimeout(() => {
    domElements.resultsContainer.scrollIntoView({ behavior: "smooth" });
  }, 300);
};

domElements.searchButton.addEventListener("click", displayInitialSearch);
domElements.searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    displayInitialSearch(e);
  }
});

domElements.seeFavs.addEventListener("click", () => {
  window.location.href = "favs.html";
});

domElements.seeFavs.addEventListener("click", () => {
  localStorage.setItem("restoreOnLoad", "true");
  window.location.href = "favs.html";
});

domElements.seeMoreBtn.addEventListener("click", () => {
  const storedLinks = localStorage.getItem("seeMoreLinks");
  if (storedLinks) {
    localStorage.setItem("restoreOnLoad", "true");
    window.location.href = "more.html";
  } else {
    alert("Please search first to load version details.");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const shouldRestore = localStorage.getItem("restoreOnLoad") === "true";
  if (shouldRestore) {
    restoreLastSearch();
    localStorage.removeItem("restoreOnLoad");
  }
});

