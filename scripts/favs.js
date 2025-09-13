import { createElementUtil } from "./utils.js";

const favoritesList = document.getElementById("favoritesList");
const backToSearch = document.getElementById("backToSearch");
const sortBtns = document.querySelectorAll(".sortBtn");

const LS_FAVS = "favs";
const LS_HIDDEN = "hiddenIds";

const readFavs = () => JSON.parse(localStorage.getItem(LS_FAVS) || "[]");
const writeFavs = (arr) => localStorage.setItem(LS_FAVS, JSON.stringify(arr));

const readHidden = () => new Set(JSON.parse(localStorage.getItem(LS_HIDDEN) || "[]"));
const writeHidden = (set) => localStorage.setItem(LS_HIDDEN, JSON.stringify([...set]));

const getItemKey = (item) => {
  if (item?.id != null) return String(item.id);
  return `${item?.title ?? "untitled"}|${item?.year ?? "?"}|${item?.cover_image ?? item?.thumb ?? ""}`;
};


function emptyState() {
  favoritesList.innerHTML = "";
  const li = createElementUtil("li");
  li.textContent = "No favorites yet. Go add some!";
  li.style.textAlign = "center";
  favoritesList.appendChild(li);
}

function addFavoriteRow(item, index) {
  const li = createElementUtil("li");
  const key = getItemKey(item);

  li.classList.add("fav");
  li.id = key;
  li.setAttribute("data-title", item.title || "Unknown");

  const label = createElementUtil("span");
  label.className = "fav-label";
  label.textContent = `${index + 1}. ${item.title || "Unknown"}`;

  const thumb = createElementUtil("img");
  thumb.classList.add("favImg");
  thumb.alt = `Cover art for ${item.title || "Unknown"}`;
  thumb.src = item.cover_image || item.thumb || "";
  thumb.loading = "lazy";
  thumb.onerror = () => { if (item.thumb && thumb.src !== item.thumb) thumb.src = item.thumb; };

  
  const removeBtn = createElementUtil("button");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add("secondary-button");
  removeBtn.style.marginLeft = "10px";
  removeBtn.addEventListener("click", () => {
    removeFromFavoritesByKey(key);
    renderFavorites(); 
  });

  li.appendChild(label);
  li.appendChild(thumb);
  li.appendChild(removeBtn);
  favoritesList.appendChild(li);
}

function updateFavoriteNumbers() {
  const items = favoritesList.querySelectorAll(".fav");
  items.forEach((item, idx) => {
    const label = item.querySelector(".fav-label");
    const title = item.getAttribute("data-title") || "Unknown";
    if (label) label.textContent = `${idx + 1}. ${title}`;
  });
}


function removeFromFavoritesByKey(key) {
  
  const favs = readFavs();
  const updated = favs.filter((it) => getItemKey(it) !== key);
  writeFavs(updated);

  
  const hidden = readHidden();
  hidden.delete(key);
  writeHidden(hidden);
}


function sortFavorites(direction) {
  const rows = Array.from(favoritesList.querySelectorAll(".fav"));
  rows.sort((a, b) => {
    const ta = (a.getAttribute("data-title") || "").toLowerCase();
    const tb = (b.getAttribute("data-title") || "").toLowerCase();
    return direction === "asc" ? ta.localeCompare(tb) : tb.localeCompare(ta);
  });
  rows.forEach((row) => favoritesList.appendChild(row));
  updateFavoriteNumbers();
}


function renderFavorites() {
  favoritesList.innerHTML = "";
  const favorites = readFavs();

  if (!favorites.length) {
    emptyState();
    return favorites;
  }

  favorites.forEach((item, index) => addFavoriteRow(item, index));
  return favorites;
}


backToSearch?.addEventListener("click", () => {
  window.location.href = "index.html";
});

sortBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    const dir = e.currentTarget.dataset.sortdir;
    if (dir === "original") {
      
      renderFavorites();
    } else if (dir === "asc" || dir === "desc") {
      sortFavorites(dir);
    }
  });
});


renderFavorites();
