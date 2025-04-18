import { addIdsToElements, shortenProfileDescription, createElementUtil } from "./utils";
import { transFormTrackData } from "./data";

const elementsWithIds = ["searchInput","searchButton","mainContainer",
  "resultsCard",
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
  "addToFavs"];

addIdsToElements(elementsWithIds);


export const buildInitialDisplay = (input, data) => {
  resultsHeading.textContent = `You searched: ${input}`;
  resultsList.classList.toggle("active");
  resultsCard.classList.toggle("active");
  vinylContainer.classList.toggle("hidden");

  trackTitle.textContent = `Track Title: ${data.title || "Unknown"}`;
  artist.textContent = `Artist: ${data.artist || "Unknown"}`;
  album.textContent = `Album: ${data.album || "Unknown"}`;
  releaseYear.textContent = `Release Year: ${data.year || "Unknown"}`;

  coverImage.src = `${data.coverImage}` 
};


export const displaySecondaryData = async (trackData, ...data) => {
  const tracksArray = transFormTrackData(trackData)

  tracksArray.forEach(track => {
    const trackListItem = createElementUtil("li");
  trackListItem.classList.add("track-list-item");

  trackListItem.textContent = `${track.position}. ${track.title} - ${track.duration}`
  resultsList.appendChild(trackListItem);
  })

  const genreType = data[0].genre.toString();
  const styleType = data[0].style.toString();

  const typeDescriptions = [genreType, styleType]

  typeDescriptions.forEach(description => {
    const descriptionItem = createElementUtil("li");
    descriptionItem.classList.add("description-item");

    if (description === genreType) {
      descriptionItem.textContent = `Genre: ${genreType}`
    } else {
      descriptionItem.textContent = `Style: ${styleType}`
    }

    resultsList.appendChild(descriptionItem)
  })
};



export const displayMoreInfo = (data) => {
  const { members, profile } = data;
   members.forEach((member, index) => {
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("detailed-info");

    detailsDiv.innerHTML = `
    <p><strong>${index + 1}:</strong> ${
      member.name || "No duration provided"
    }</p>
  `;
  trackImageContainer.appendChild(detailsDiv);
  });
  description.innerHTML = `
    <p> ${shortenProfileDescription(profile || "No profile data")}</p>
  `;
};

export const addLocalStorageItem = (id) => {
  
}