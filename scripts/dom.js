import {
  addIdsToElements,
  resetContainers,
  createElementUtil,
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
  "amount",
];

const domElements = addIdsToElements(elementsWithIds);

const getCountersElement = () => document.getElementById("counters");
const getVersionsContainer = () =>
  domElements.versionsGrid || document.getElementById("versionsGrid");

const extractYearValue = (cardEl) => {
  const yearNode = cardEl.querySelector(".v-year");
  if (!yearNode) return "Unknown";

  const rawText = yearNode.textContent || "";
  const colonIndex = rawText.indexOf(":");
  const parsed = colonIndex >= 0 ? rawText.slice(colonIndex + 1).trim() : rawText.trim();
  return parsed || "Unknown";
};

function renderYearCountersFromDom() {
  const countersEl = getCountersElement();
  if (!countersEl) return;

  const container = getVersionsContainer();
  if (!container) {
    countersEl.innerHTML = "";
    return;
  }

  const cards = Array.from(
    container.querySelectorAll(".version:not(.empty)")
  );

  if (!cards.length) {
    countersEl.innerHTML = "";
    return;
  }

  const counts = new Map();
  cards.forEach((card) => {
    const year = extractYearValue(card);
    counts.set(year, (counts.get(year) || 0) + 1);
  });

  const entries = Array.from(counts.entries()).sort((a, b) => {
    const [yearA] = a;
    const [yearB] = b;

    if (yearA === "Unknown" && yearB !== "Unknown") return 1;
    if (yearB === "Unknown" && yearA !== "Unknown") return -1;
    return yearA.localeCompare(yearB);
  });

  countersEl.innerHTML = "";
  entries.forEach(([year, count]) => {
    const pill = createElementUtil("span");
    pill.className = "pill";
    pill.textContent = `${year}: ${count}`;
    countersEl.appendChild(pill);
  });
}

const emptyStateMessage = "All items are in Favorites. Remove some to see them here.";

const createEmptyStateNode = () => {
  const li = createElementUtil("li");
  li.className = "version empty";
  li.textContent = emptyStateMessage;
  return li;
};

const getHiddenIds = () =>
  new Set(JSON.parse(localStorage.getItem("hiddenIds") || "[]"));
const setHiddenIds = (set) =>
  localStorage.setItem("hiddenIds", JSON.stringify([...set]));

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
    domElements.coverImg || document.getElementById("coverImage") || null;

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

const renderVersions = (data) => {
  resetContainers(domElements.versionsGrid);

  const hiddenIds = getHiddenIds();
  const visibleIds = data.filter((item) => !hiddenIds.has(String(item.id)));

  if (domElements.amount) {
    domElements.amount.textContent = `(Showing ${visibleIds.length} of ${data.length})`;
  }

  if (visibleIds.length === 0) {
    domElements.versionsGrid.appendChild(createEmptyStateNode());
    renderYearCountersFromDom();
    return;
  }

  visibleIds.forEach((item, index) => {
    const li = createElementUtil("li");
    li.classList.add("version");
    li.id = `version-${item.id ?? index}`;
    li.dataset.id = String(item.id ?? index);

    li.innerHTML = `
      <span class="v-title">Title: ${item.title || "Unknown"}</span>
      <span class="v-type">Release: ${
        item.type === "release"
          ? "Single or EP"
          : item.type || "Unknown"
      }</span>
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

  renderYearCountersFromDom();
};

const handleFavorites = (version, cardEl) => {
  const favs = JSON.parse(localStorage.getItem("favs") || "[]");
  const alreadyInFavorites = favs.some((fav) => fav.id === version.id);

  if (!alreadyInFavorites) {
    localStorage.setItem("favs", JSON.stringify([...favs, version]));
    const hiddenIds = getHiddenIds();
    hiddenIds.add(String(version.id));
    setHiddenIds(hiddenIds);
    cardEl.remove();

    if (!domElements.versionsGrid.querySelector(".version:not(.empty)")) {
      domElements.versionsGrid.appendChild(createEmptyStateNode());
    }
  }

  renderYearCountersFromDom();

  const badge = document.createElement("span");
  badge.className = alreadyInFavorites ? "badge already" : "badge added";
  badge.textContent = alreadyInFavorites
    ? "Already in Favorites!"
    : "Added to Favorites!";
  document.body.appendChild(badge);
  requestAnimationFrame(() => {
    badge.style.opacity = "1";
    setTimeout(() => {
      badge.remove();
    }, 700);
  });
};

export {
  renderInitialDisplay,
  handleFavorites,
  domElements,
  renderYearCountersFromDom,
  renderVersions,
};
