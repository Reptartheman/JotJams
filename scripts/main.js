const discCogsapiKey = "jIsWwEpLHMbcjqlQQSea";
const input = document.getElementById("searchInput");
const artistInput = document.getElementById("artistInput");
const trackInput = document.getElementById("trackInput");
const searchButton = document.getElementById("searchButton");
const randomButton = document.getElementById("randomSearchButton");
const resultsHeading = document.getElementById("resultsHeading");
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

class FetchWrapper {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get(endpoint) {
    return fetch(this.baseURL + endpoint)
      .then((response) => response.json())
      .catch((err) => {
        console.error("Error fetching data:", err);
        return null;
      });
  }
}

const fetchData = async (query) => {
  const API = new FetchWrapper(`https://api.discogs.com/`);
  const data = await API.get(query);
  return data;
};

const getRandomData = async () => {
  

  const randomPageNumber = getRandomNumber(1, 100);
  const randomQuery = `database/search?&type=artist&key=${discCogsapiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=${randomPageNumber}&per_page=1`;
  const data = await fetchData(randomQuery);
  console.log(data);
  return data.results;
};

const getSearchedQuery = async (trackTitle, artistName) => {
  const searchedQuery = `database/search?q=${encodeURIComponent(
    trackTitle
  )}+${encodeURIComponent(
    artistName
  )}&key=${discCogsapiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=1&per_page=4`;
  const data = await fetchData(searchedQuery);
  console.log(data);
  return data.results;
};

const displayTrackInfo = async (dataArray, input) => {
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "";
  resultsHeading.textContent = `Your search results ${input}`;
  dataArray.forEach((data, index) => {
    const trackElement = document.createElement("div");
    trackElement.classList.add("track-card");
    trackElement.innerHTML = `
      <li class="results-item" id="${index}">Artist: ${
      data.title || "Unknown"
    }</li>
      <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />`;
    resultsContainer.appendChild(trackElement);
  });
};

const getMoreInfo = async (resourceLink) => {

    const detailedInfo = await fetchData(resourceLink);
    console.log(detailedInfo);
    return detailedInfo;
};



/* const moreInfoDisplay = (info) => {
  const artistDescription = info.profile;
  const full = info.realname;

  return `<div class="detailed-info">
      <div class="info-section">
        <h3>Additional details</h3>
        <p><strong>Full name:</strong> ${full}</p>
        <p><strong>Profile:</strong> ${artistDescription}</p>
      </div>
      </div>`
} */

const renderRandomData = async (e) => {
  e.preventDefault();
  const randomItem = await getRandomData();
  const resource = await getMoreInfo(randomItem[0].resource_url)
  console.log(resource);
  return displayTrackInfo(randomItem, "");
};

const renderSearchedData = async (e) => {
  e.preventDefault();
  const artistName = artistInput.value.trim();
  const trackTitle = trackInput.value.trim();
  const searchedItem = await getSearchedQuery(trackTitle, artistName);
  const trackAndArtist = `${trackTitle} by ${artistName} `;
  return displayTrackInfo(searchedItem, trackAndArtist);
};

randomButton.addEventListener("click", renderRandomData);
searchButton.addEventListener("click", renderSearchedData);
