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

  favorites.forEach((item, index) => {
    const li = createElementUtil("li");
    const thumbNail = createElementUtil("img");
    li.classList.add("fav");
    li.id = item.title;
    li.setAttribute('data-title', item.title);
    li.textContent = `${index + 1}. ${item.title}`;
    thumbNail.classList.add("favImg");
    thumbNail.src = `${item.cover_image}`

    const removeBtn = createElementUtil("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("secondary-button");
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", () => {
      const updated = favorites.filter(fave => fave !== item);
      localStorage.setItem("favs", JSON.stringify(updated));
      li.remove();
    });
    li.appendChild(thumbNail);
    li.appendChild(removeBtn);
    
    favoritesList.appendChild(li);
  });

  return favorites;
};

function updateFavoriteNumbers() {
  const items = favoritesList.querySelectorAll(".fav");
  items.forEach((item, idx) => {
    item.childNodes[0].textContent = `${idx + 1}. ${item.getAttribute('data-title')}`;
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
