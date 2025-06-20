import { discogsAPIData } from "./api.js";
import { transFormTrackData } from "./data.js";
import {
  createElementUtil,
  shortenProfileDescription,
  returnPromises
} from "./utils.js";

function renderCarousel(images) {
  const slidesEl = document.getElementById("slides");
  slidesEl.innerHTML = "";   // clear old slides

  images.forEach(img => {
    const slide = document.createElement("img");
    slide.src = img.uri150;
    slide.alt = "Cover art";
    // store full-size link for lightbox
    slide.dataset.full = img.resource_url;
    slidesEl.appendChild(slide);
  });

  // wire left/right buttons
  document.querySelector(".prev").onclick = () =>
    slidesEl.scrollBy({ left: -slidesEl.clientWidth, behavior: "smooth" });
  document.querySelector(".next").onclick = () =>
    slidesEl.scrollBy({ left:  slidesEl.clientWidth, behavior: "smooth" });

  // click any thumb to open lightbox
  slidesEl.onclick = e => {
    if (e.target.tagName === "IMG") {
      openLightbox(e.target.dataset.full);
    }
  };
}


function openLightbox(src) {
  const overlay = document.createElement("div");
  overlay.id = "lightbox";
  overlay.innerHTML = `
    <div class="lb-inner">
      <img src="${src}" alt="Full cover art" />
      <button class="lb-close">&times;</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", e => {
    if (e.target.id === "lightbox" || e.target.matches(".lb-close")) {
      overlay.remove();
    }
  });
}



const backToSearch = document.getElementById("backToSearch");
const membersList = document.getElementById("membersList");
const trackListingContainer = document.getElementById("trackListingContainer");
const descriptionBox = document.getElementById("description");

backToSearch.addEventListener("click", () => {
  window.location.href = "index.html";
});

const links = JSON.parse(localStorage.getItem("seeMoreLinks"));
if (!links) {
  alert("No release data available.");
  window.location.href = "index.html";
}



const renderMembers = (members) => {
  if (!members) {
    const li = createElementUtil("li");
    li.textContent = "No members provided.";
    membersList.appendChild(li);
    return;
  }

  members.forEach((member, index) => {
    const li = createElementUtil("li");
    li.classList.add("detailed-info");
    li.textContent = `${index + 1}. ${member.name}`;
    membersList.appendChild(li);
  });
};

const renderProfileDescription = (profile) => {
  const p = createElementUtil("p");
  p.textContent = shortenProfileDescription(profile || "No profile description available.");
  descriptionBox.appendChild(p);
};

const renderTrackList = (trackData) => {
  const tracks = transFormTrackData(trackData);
  tracks.forEach(({ position, title, duration }) => {
    const li = createElementUtil("li");
    li.classList.add("track-list-item");
    li.textContent = `${position}. ${title} - ${duration}`;
    trackListingContainer.appendChild(li);
  });
};


const renderEverything = async () => {
  const artistData      = await discogsAPIData(links.artistResourceUrl);
  const mainReleaseData = await discogsAPIData(links.mainReleaseData);
  console.log(mainReleaseData);

  renderProfileDescription(artistData.profile);
  renderMembers(artistData.members);
  renderTrackList(mainReleaseData.tracklist);

  renderCarousel(mainReleaseData.images);
};

renderEverything();
