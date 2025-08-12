import { createElementUtil } from "./utils.js";

const favoritesList = document.getElementById("favoritesList");
const backToSearch = document.getElementById("backToSearch");
const sortBtns = document.querySelectorAll(".sortBtn");

backToSearch.addEventListener("click", () => {
  window.location.href = "index.html";
});

const renderFavorites = () => {
  favoritesList.innerHTML = "";
  const favorites = JSON.parse(localStorage.getItem("favs")) || [];

  if (favorites.length === 0) {
    const emptyMsg = createElementUtil("li");
    emptyMsg.textContent = "No favorites yet. Go add some!";
    emptyMsg.style.textAlign = "center";
    favoritesList.appendChild(emptyMsg);
    return;
  }

  favorites.forEach((item) => {
    const li = createElementUtil("li");
    li.classList.add("fav");
    li.setAttribute("data-title", item.title);
    li.id = item.title;

    const thumbNail = createElementUtil("img");
    thumbNail.classList.add("favImg");
    thumbNail.src = item.cover_image || item.thumb || "";
    thumbNail.alt = `Cover art for ${item.title}`;

    const titleSpan = createElementUtil("span");
    titleSpan.textContent = item.title;
    titleSpan.style.fontWeight = "bold";

    const removeBtn = createElementUtil("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("secondary-button");
    removeBtn.addEventListener("click", () => {
      const updated = favorites.filter(fave => fave.id !== item.id);
      localStorage.setItem("favs", JSON.stringify(updated));
      li.remove();
    });

    li.appendChild(thumbNail);
    li.appendChild(titleSpan);
    li.appendChild(removeBtn);
    favoritesList.appendChild(li);
  });

  return favorites;
};

function updateFavoriteNumbers() {
  const items = favoritesList.querySelectorAll(".fav");
  items.forEach((item, idx) => {
    const title = item.getAttribute('data-title');
    const titleSpan = item.querySelector("span");
    if (titleSpan) titleSpan.textContent = `${idx + 1}. ${title}`;
  });
}

function sortFavorites(direction) {
  const favorites = favoritesList.querySelectorAll(".fav");
  const favoritesArray = Array.from(favorites);
  favoritesArray.sort((a, b) => {
    if (direction === 'asc') {
      return a.id.localeCompare(b.id);
    } else {
      return b.id.localeCompare(a.id);
    }
  });

  favoritesArray.forEach(item => favoritesList.appendChild(item));
  updateFavoriteNumbers();
}

sortBtns.forEach(button => {
  button.addEventListener('click', (e) => {
    const direction = e.target.dataset.sortdir;
    if (direction === "original") {
      renderFavorites();
    } else {
      sortFavorites(direction);
    }
  });
});

renderFavorites();
