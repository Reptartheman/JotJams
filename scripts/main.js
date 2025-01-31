const input = document.getElementById("searchInput");
const artistInput = document.getElementById("artistInput");
const trackInput = document.getElementById("trackInput");
const searchButton = document.getElementById("searchButton");
const randomButton = document.getElementById("randomSearchButton");
const moreInfoButton = document.getElementById("moreInfo");
const resultsHeading = document.getElementById("resultsHeading");
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

const queryConfig = {
  baseURL: "https://api.discogs.com",
  key: "jIsWwEpLHMbcjqlQQSea",
  secret: "cUgaJgZJhrLgLKxattfmUZscPaUBDrcF",
  byArtist: "/artists/",
  byMaster: "/masters/",
  byRelease: "/releases/",
  byLabel: "/labels/"
};

const dataFetcher = (baseConfig) => {
  const fetchFromURL = async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (err) {
      console.error("Error fetching data:", err);
      return null;
    }
  };

  const fetchFromEndpoint = (endpoint) => {
    const url = endpoint.startsWith("http") ? endpoint : `${baseConfig.baseURL}${endpoint}`;
    return fetchFromURL(url);
  };

  return {
    fetch: fetchFromEndpoint,
  };
};

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const discogsAPI = dataFetcher(queryConfig);

const getRandomArtist = async () => {
  const searchTypes = ['artist', 'master', 'label', 'release']
  const searchType = getRandomItem(searchTypes);
  const randomPageNumber = getRandomNumber(1, 100);
  const query = `/database/search?&type=${searchType}&key=${queryConfig.key}&secret=${queryConfig.secret}&page=${randomPageNumber}&per_page=1`;
  const data = await discogsAPI.fetch(query);
  return data?.results || [];
};

const getSearchedArtist = async (trackTitle, artistName) => {
  const query = `/database/search?q=${encodeURIComponent(trackTitle)}+${encodeURIComponent(artistName)}&key=${queryConfig.key}&secret=${queryConfig.secret}&page=1&per_page=4`;
  const data = await discogsAPI.fetch(query);
  return data?.results || [];
};

const displayTrackInfo = async (dataArray, input) => {
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "";
  resultsHeading.textContent = `Your search results ${input}`;
  dataArray.forEach((data, index) => {
    const trackElement = document.createElement("div");
    trackElement.classList.add("track-card");
    trackElement.innerHTML = `
      <li class="results-item" id="${index}">Title: ${data.title || "Unknown"}</li>
      <li class="results-item" id="${index}">Type: ${capitalizeFirstLetter(data.type) || "Unknown"}</li>
      <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />`;
    resultsContainer.appendChild(trackElement);
  });
};

const getMoreInfo = (resourceUrl) => discogsAPI.fetch(resourceUrl);

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
  const randomItem = await getRandomArtist();
  console.log(randomItem);
  return displayTrackInfo(randomItem, "");
};

const renderSearchedData = async (e) => {
  e.preventDefault();
  const artistName = artistInput.value.trim();
  const trackTitle = trackInput.value.trim();
  const searchedItem = await getSearchedArtist(trackTitle, artistName);
  console.log(searchedItem);
  const trackAndArtist = `${trackTitle} by ${artistName} `;
  return displayTrackInfo(searchedItem, trackAndArtist);
};



moreInfoButton.addEventListener("click", (e) => {
  
})
randomButton.addEventListener("click", renderRandomData);
searchButton.addEventListener("click", renderSearchedData);
