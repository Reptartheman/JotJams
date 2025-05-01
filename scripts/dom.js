import {
  addIdsToElements,
  shortenProfileDescription,
  createElementUtil,
  resetContainers,
} from "./utils";
import { transFormTrackData } from "./data";

const elementsWithIds = [
  "searchInput",
  "searchButton",
  "mainContainer",
  "resultsContainer",
  "resultsList",
  "resultsHeading",
  "trackTitle",
  "artist",
  "album",
  "releaseYear",
  "trackImageContainer",
  "trackListingBtn",
  "moreInfoBtn",
  "coverImg",
  "vinylContainer",
  "description",
  "addToFavs",
  "seeFavs",
  "trackListingContainer",
  "moreInfoContainer",
  "favoritesList"
];

const domElements = addIdsToElements(elementsWithIds);

export const renderInitialDisplay = (input, data) => {
  domElements.resultsHeading.textContent = `You searched: ${input}`;
  domElements.trackTitle.textContent = `Track Title: ${data.title || "Unknown"}`;
  domElements.artist.textContent = `Artist: ${data.artist || "Unknown"}`;
  domElements.album.textContent = `Album: ${data.album || "Unknown"}`;
  domElements.releaseYear.textContent = `Release Year: ${data.year || "Unknown"}`;
  coverImage.src = `${data.coverImage}`;

  if (!domElements.resultsList.classList.contains("active")) {
    domElements.resultsList.classList.toggle("active");
    domElements.resultsContainer.classList.toggle("active");
    domElements.vinylContainer.classList.add("hidden");
  } else {
    resetContainers(domElements.trackListingContainer, domElements.moreInfoContainer, domElements.description);
  }
};

const renderTrackList = (tracks) => {
  tracks.forEach(({ position, title, duration }) => {
    const trackListItem = createElementUtil("li");
    trackListItem.classList.add("track-list-item");
    trackListItem.textContent = `${position}. ${title} - ${duration}`;
    domElements.trackListingContainer.appendChild(trackListItem);
  });
};

const renderTypeDescriptions = ({ genre, style }) => {
  const descriptions = [`Genre: ${genre}`, `Style: ${style}`];

  descriptions.forEach((text) => {
    const descriptionItem = createElementUtil("li");
    descriptionItem.classList.add("description-item");
    descriptionItem.textContent = text;
    domElements.moreInfoContainer.appendChild(descriptionItem);
  });
};

const renderMembers = ({ members }) => {
  if(!members) {
    return domElements.moreInfoContainer.innerHTML = `
      <p> No member info provided </p>
    `;
  };
  members.forEach((member, index) => {
    const detailsItem = createElementUtil("li");
    detailsItem.classList.add("detailed-info");

    detailsItem.textContent = `${index + 1}. ${
      member?.name || "No members provided"
    }`;
    domElements.moreInfoContainer.appendChild(detailsItem);
  });
};

const renderProfileDescription = ({ profile }) => {
  const descriptionText = createElementUtil("p");
  descriptionText.textContent = `${shortenProfileDescription(
    profile || "No profile data"
  )}`;
  domElements.description.appendChild(descriptionText);
};


export const displaySecondaryData = async (trackData, secondaryData) => {
  resetContainers(domElements.trackListingContainer);
  
  const tracksArray = transFormTrackData(trackData);
  renderTrackList(tracksArray);
  renderTypeDescriptions(secondaryData);
};


export const displayMoreInfo = (data) => {
  resetContainers(domElements.moreInfoContainer, domElements.description);
  renderMembers(data);
  renderProfileDescription(data);
};

export const addToFavorites = () => {
  const songName = domElements.trackTitle.textContent.slice(13);
  const artistName = domElements.artist.textContent.slice(8);
  const favsDescription = `${artistName} ${songName}`;

  let favs = JSON.parse(localStorage.getItem('favs')) || [];
  
  if (!favs.includes(favsDescription)) {
    favs.push(favsDescription);
    localStorage.setItem('favs', JSON.stringify(favs));
    createFavContainerItem([favsDescription]);
  }
}

const createFavContainerItem = (array) => {
  array.forEach((item, index) => {
    const newFav = createElementUtil("li");
    newFav.classList.add("fav");
    newFav.textContent = `${index + 1}. ${item}`;
    domElements.favoritesList.appendChild(newFav);
  });
};



export const loadFavorites = () => {
  const savedFavorites = JSON.parse(localStorage.getItem('favs')) || [];

  if (savedFavorites.length > 0) {
    createFavContainerItem(savedFavorites);
  }
};

