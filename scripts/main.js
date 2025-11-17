import { initialDataFetch, dataFromMasterReleaseURL } from "./api";

import {
  getMasterUrl,
  getImages,
  getPrimaryData,
  getAllOtherUrls,
} from "./data";

import {
  renderInitialDisplay,
  domElements,
  renderVersions,
} from "./dom";
import { getUserInput } from "./utils";

const LS_KEYS = {
  previousResults: "previousSearch",
  term: "lastSearchTerm",
  master: "lastMasterURL",
  seeMore: "seeMoreLinks",
  restore: "restoreOnLoad",
};

const storage = {
  get: (key) => localStorage.getItem(key),
  getJson: (key) => JSON.parse(localStorage.getItem(key) ?? "null"),
  set: (key, value) => localStorage.setItem(key, value),
  setJson: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (...keys) => keys.forEach((key) => localStorage.removeItem(key)),
};

const state = { currentLinks: null };

const renderSearchResults = ({ primary, versions, coverImage }) => {
  renderInitialDisplay({ ...primary, coverImage });
  renderVersions(versions);
};

const fetchSearchResults = async (term) => {
  const initialData = await initialDataFetch(term);
  const masterUrl = getMasterUrl(initialData);
  const mainData = masterUrl ? await dataFromMasterReleaseURL(masterUrl) : null;

  if (!mainData) {
    throw new Error("Missing release details for this search.");
  }

  state.currentLinks = getAllOtherUrls(mainData);

  return {
    term,
    masterUrl,
    versions: initialData,
    primary: getPrimaryData(mainData),
    coverImage: getImages(initialData).coverImage,
  };
};

const persistSearch = ({ term, masterUrl, versions }) => {
  storage.set(LS_KEYS.term, term);
  storage.setJson(LS_KEYS.previousResults, versions);
  if (masterUrl) {
    storage.set(LS_KEYS.master, masterUrl);
  }
  storage.setJson(LS_KEYS.seeMore, state.currentLinks);
};

const handleSearchSubmit = async (event) => {
  event.preventDefault();
  storage.remove(
    LS_KEYS.previousResults,
    LS_KEYS.term,
    LS_KEYS.master,
    LS_KEYS.seeMore
  );

  try {
    const result = await fetchSearchResults(
      getUserInput(domElements.searchInput)
    );
    renderSearchResults(result);
    persistSearch(result);
  } catch (error) {
    alert("Sorry, we couldn't complete your search. Please try again.");
    console.error("Search failed:", error);
  }
};

const restoreLastSearch = async () => {
  const versions = storage.getJson(LS_KEYS.previousResults);
  if (!versions?.length) return;

  const masterUrl = storage.get(LS_KEYS.master);
  const coverImage = getImages(versions).coverImage;

  renderSearchResults({
    versions,
    primary: getPrimaryData(versions[0]),
    coverImage,
  });

  if (masterUrl) {
    const mainData = await dataFromMasterReleaseURL(masterUrl);
    if (mainData) {
      state.currentLinks = getAllOtherUrls(mainData);
      storage.setJson(LS_KEYS.seeMore, state.currentLinks);
      renderSearchResults({
        versions,
        primary: getPrimaryData(mainData),
        coverImage,
      });
    }
  }

  setTimeout(
    () => domElements.resultsContainer.scrollIntoView({ behavior: "smooth" }),
    300
  );
};

const navigateWithRestore = (path) => {
  storage.set(LS_KEYS.restore, "true");
  window.location.href = path;
};


domElements.searchButton.addEventListener("click", handleSearchSubmit);
domElements.searchInput.addEventListener(
  "keydown",
  (e) => e.key === "Enter" && handleSearchSubmit(e)
);
/* domElements.seeFavs.addEventListener("click", () =>
  navigateWithRestore("favs.html")
); */
domElements.seeMoreBtn.addEventListener("click", () => {
  if (!storage.get(LS_KEYS.seeMore))
    return alert("Please search first to load version details.");
  navigateWithRestore("more.html");
});

window.addEventListener("DOMContentLoaded", async () => {
  if (storage.get(LS_KEYS.restore) !== "true") return;
  await restoreLastSearch();
  storage.remove(LS_KEYS.restore);
});

