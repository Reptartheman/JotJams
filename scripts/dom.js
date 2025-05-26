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
  "seeMoreBtn",
  "trackListingContainer",
  "moreInfoContainer",
  "favoritesList",
  "tracksMembersLists",
  "additionalReleases",
  "additionalReleasesList"
];

const domElements = addIdsToElements(elementsWithIds);

const renderInitialDisplay = (input, data) => {
  domElements.resultsHeading.textContent = `Results for: ${input}`;
  domElements.trackTitle.textContent = `Track Title: ${data.title || "Unknown"}`;
  domElements.artist.textContent = `Artist: ${data.artist || "Unknown"}`;
  domElements.album.textContent = `Album: ${data.album || "Unknown"}`;
  domElements.releaseYear.textContent = `Release Year: ${data.year || "Unknown"}`;
  coverImage.src = `${data.coverImage}`;

  if (!domElements.resultsList.classList.contains("active")) {
    domElements.resultsList.classList.toggle("active");
    domElements.resultsContainer.classList.toggle("active");
    //domElements.addToFavs.classList.toggle("active");
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
    domElements.trackListingContainer.appendChild(descriptionItem);
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

/* export const renderVersions = (data) => {
   data.forEach((item, index) => {
    const listItem = createElementUtil("li");
    const albumArt = createElementUtil("img");
    albumArt.src = item.cover_image || "";
   listItem.classList.add("version");
   listItem.id = `version-${index}`;
   listItem.innerHTML = `<span>Title: ${item.title}</span><br>
   <span>Release: ${item.type === "release" ? "Single or EP": item.type}</span><br>
   <span>Year: ${item.year || "Unknown"}</span>`;
   listItem.appendChild(albumArt);
   domElements.additionalReleasesList.appendChild(listItem);
   })
} */


const displaySecondaryData = async (trackData, secondaryData) => {
  resetContainers(domElements.trackListingContainer);
  
  const tracksArray = transFormTrackData(trackData);
  renderTrackList(tracksArray);
  renderTypeDescriptions(secondaryData);
};


const displayMoreInfo = (data) => {
  resetContainers(domElements.moreInfoContainer, domElements.description);
  renderMembers(data);
  domElements.tracksMembersLists.classList.toggle('initial')
  renderProfileDescription(data);
  
};

const addToFavorites = () => {
  const songName = domElements.trackTitle.textContent.slice(13);
  const artistName = domElements.artist.textContent.slice(8);
  const favsDescription = `${artistName} ${songName}`;
  const originalText = addToFavs.textContent;
  let favs = JSON.parse(localStorage.getItem('favs')) || [];
  
  if (!favs.includes(favsDescription)) {
    favs.push(favsDescription);
    localStorage.setItem('favs', JSON.stringify(favs));
    domElements.addToFavs.textContent = "Added!"
    domElements.addToFavs.classList.add("added");
    domElements.addToFavs.disabled = true;

    setTimeout(() => {
      domElements.addToFavs.textContent = originalText;
      domElements.addToFavs.classList.remove("added");
      domElements.addToFavs.disabled = false;
    }, 1000); 
  } else if (favs.includes(favsDescription)) {
    domElements.addToFavs.textContent = 'Already in Favorites!';
    domElements.addToFavs.classList.add("already-there");
    domElements.addToFavs.disabled = true;
    setTimeout(() => {
      domElements.addToFavs.textContent = originalText;
      domElements.addToFavs.classList.remove("already-there");
      domElements.addToFavs.disabled = false;
    }, 1000);
  }
}


export {
  renderInitialDisplay,
  displaySecondaryData,
  displayMoreInfo,
  addToFavorites,
  domElements,
};

