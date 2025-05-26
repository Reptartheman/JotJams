import { createElementUtil } from "./utils.js";

const favoritesList = document.getElementById("favoritesList");
const backToSearch = document.getElementById("backToSearch");

backToSearch.addEventListener("click", () => {
  window.location.href = "index.html";
});

const renderFavorites = () => {
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
    li.classList.add("fav");
    li.textContent = `${index + 1}. ${item}`;

    const removeBtn = createElementUtil("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("secondary-button");
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", () => {
      const updated = favorites.filter(fave => fave !== item);
      localStorage.setItem("favs", JSON.stringify(updated));
      li.remove();
    });

    li.appendChild(removeBtn);
    favoritesList.appendChild(li);
  });
};

renderFavorites();
