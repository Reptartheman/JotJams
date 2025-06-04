import { discogsAPIData } from "./api.js";
import { transFormTrackData } from "./data.js";
import {
  createElementUtil,
  shortenProfileDescription,
  returnPromises
} from "./utils.js";

const backToSearch = document.getElementById("backToSearch");
const versionsList = document.getElementById("additionalReleasesList");
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

const renderArtistImage = (image) => {
  const img = createElementUtil("img");
  
}

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

const renderTypeDescriptions = ({ genre, style }) => {
  const descriptions = [`Genre: ${genre}`, `Style: ${style}`];

  descriptions.forEach((text) => {
    const descriptionItem = createElementUtil("li");
    descriptionItem.classList.add("description-item");
    descriptionItem.textContent = text;
    domElements.trackListingContainer.appendChild(descriptionItem);
  });
};


const renderEverything = async () => {
  const artistData      = await discogsAPIData(links.artistResourceUrl);
  const mainReleaseData = await discogsAPIData(links.mainReleaseData);
  console.log(mainReleaseData);

  renderProfileDescription(artistData.profile);
  renderMembers(artistData.members);
  renderTrackList(mainReleaseData.tracklist);
};

renderEverything();
