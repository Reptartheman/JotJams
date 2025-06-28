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
  "versionsGrid",
  "amount"
];

const domElements = addIdsToElements(elementsWithIds);

const renderInitialDisplay = (data) => {
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
  domElements.amount.textContent = `(Showing ${data.length})`
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

    li.addEventListener("click", () => handleFavorites(item, li));

    domElements.versionsGrid.appendChild(li);
  });
};


const handleFavorites = (version, cardEl) => {
  const favs = JSON.parse(localStorage.getItem("favs")) || [];
  const alreadyInFavorites = favs.some(fav => fav.id === version.id)
  if (!alreadyInFavorites) {
    favs.push(version);
    localStorage.setItem("favs", JSON.stringify(favs));
  }

  const badge = document.createElement("span");
  badge.className = alreadyInFavorites ? "badge already" : "badge added";
  badge.textContent = alreadyInFavorites ? "Already in Favorites!" : "Added to Favorites!";

  cardEl.style.position = "relative";
  cardEl.appendChild(badge);

  requestAnimationFrame(() => {
    badge.style.opacity = "1";
    setTimeout(() => {
      badge.style.opacity = "0";
      badge.addEventListener("transitionend", () => badge.remove());
    }, 800);
  });


};



export {
  renderInitialDisplay,
  handleFavorites,
  domElements,
};

