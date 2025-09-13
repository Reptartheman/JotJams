import {
  countByYear,
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

export function renderYearCounters(items) {
  const countersEl = document.getElementById("counters");
  if (!countersEl) return;
  countersEl.innerHTML = "";
  countByYear(items).forEach(([year, count]) => {
    const pill = createElementUtil("span");
    pill.className = "pill";
    pill.textContent = `${year}: ${count}`;
    countersEl.appendChild(pill);
  });
}


const renderInitialDisplay = (data) => {

  const title = data?.title || "Unknown";
  const artist = data?.artist || "Unknown";
  const album = data?.album || "Unknown";
  const year = data?.year || "Unknown";

  domElements.trackTitle.textContent = `Track Title: ${title || "Unknown"}`;
  domElements.artist.textContent = `Artist: ${artist || "Unknown"}`;
  domElements.album.textContent = `Album: ${album || "Unknown"}`;
  domElements.releaseYear.textContent = `Release Year: ${year || "Unknown"}`;
  domElements.coverImage = `${data.coverImage}`;

  const coverImageElement =
    domElements.coverImg ||
    document.getElementById("coverImage") ||
    null;

  if (coverImageElement) {
    coverImageElement.src = data?.coverImage || "";
    coverImageElement.alt = `Cover image for ${title}`;
  }

  if (!domElements.resultsList.classList.contains("active")) {
    domElements.resultsList.classList.toggle("active");
    domElements.resultsContainer.classList.toggle("active");
    domElements.vinylContainer.classList.add("hidden");
  } else {
    resetContainers(domElements.versionsGrid);
  }
};

export const renderVersions = (data) => {
  resetContainers(domElements.versionsGrid);

  const hiddenIds = new Set(JSON.parse(localStorage.getItem("hiddenIds") || "[]"));
  const visibleIds = data.filter(item => !hiddenIds.has(String(item.id)));

  if (domElements.amount) {
    domElements.amount.textContent = `(Showing ${visibleIds.length} of ${data.length})`;
  }

  if (visibleIds.length === 0) {
    const li = createElementUtil("li");
    li.className = "version empty";
    li.textContent = "All items are in Favorites. Remove some to see them here.";
    domElements.versionsGrid.appendChild(li);
    return;
  }

  visibleIds.forEach((item, index) => {
    const li = createElementUtil("li");
    li.classList.add("version");
    li.id = `version-${item.id ?? index}`;
    li.dataset.id = String(item.id ?? index);

    li.innerHTML = `
      <span class="v-title">Title: ${item.title || "Unknown"}</span>
      <span class="v-type">Release: ${item.type === "release" ? "Single or EP" : (item.type || "Unknown")}</span>
      <span class="v-year">Year: ${item.year || "Unknown"}</span>
    `;

    const img = createElementUtil("img");
    img.alt = `Cover art for ${item.title || "Unknown"}`;
    img.loading = "lazy";
    img.src = item.cover_image || item.thumb || "";
    img.onerror = () => {
      if (item.thumb && img.src !== item.thumb) {
        img.src = item.thumb;
      } else {
        img.remove();
      }
    };

    li.appendChild(img);
    li.addEventListener("click", () => handleFavorites(item, li));

    domElements.versionsGrid.appendChild(li);
  });
};



const getHiddenIds = () => new Set(JSON.parse(localStorage.getItem("hiddenIds") || "[]"));
const setHiddenIds = (set) => localStorage.setItem("hiddenIds", JSON.stringify([...set]));

const handleFavorites = (version, cardEl) => {
  const favs = JSON.parse(localStorage.getItem("favs") || "[]");
  const alreadyInFavorites = favs.some(favs => favs.id === version.id);

  if (!alreadyInFavorites) {
    localStorage.setItem("favs", JSON.stringify([...favs, version]));
    const hiddenIds = getHiddenIds();
    hiddenIds.add(String(version.id));
    setHiddenIds(hiddenIds);
    cardEl.remove();
  }

  const badge = document.createElement("span");
  badge.className = alreadyInFavorites ? "badge already" : "badge added";
  badge.textContent = alreadyInFavorites ? "Already in Favorites!" : "Added to Favorites!";
  document.body.appendChild(badge);
  requestAnimationFrame(() => {
    badge.style.opacity = "1";
    setTimeout(() => { badge.remove(); }, 700);
  });
};




export {
  renderInitialDisplay,
  handleFavorites,
  domElements,
};

