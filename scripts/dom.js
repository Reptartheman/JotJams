import {
  addIdsToElements,
  resetContainers,
  createElementUtil
} from "./utils";

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
  "additionalReleasesList",
  "versionsGrid"
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

export const renderVersions = (data) => {
  //domElements.versionsGrid.innerHTML = ""; // clear old entries
  data.forEach((item, index) => {
    const li = createElementUtil("li");
    li.classList.add("version");
    li.id = `version${index}`;
    li.style.gridArea = `version${index + 1}`;

    // render text info
    li.innerHTML = `
      <span>Title: ${item.title}</span>
      <span>Release: ${item.type === "release" ? "Single or EP" : item.type}</span>
      <span>Year: ${item.year || "Unknown"}</span>
    `;

    // append cover image (now available)
    const img = createElementUtil("img");
    img.src = item.cover_image || item.thumb || "";
    img.alt = `Cover art for ${item.title}`;
    li.appendChild(img);

    domElements.versionsGrid.appendChild(li);
  });
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
  addToFavorites,
  domElements,
};

