const input = document.getElementById("searchInput");
const artistInput = document.getElementById("artistInput");
const trackInput = document.getElementById("trackInput");
const searchButton = document.getElementById("searchButton");
const randomButton = document.getElementById("randomSearchButton");
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

const queryConfig = {
  baseURL: "https://api.discogs.com",
  key: "jIsWwEpLHMbcjqlQQSea",
  secret: "cUgaJgZJhrLgLKxattfmUZscPaUBDrcF",
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
    const url = endpoint.startsWith("http")
      ? endpoint // if true: use full URL as is
      : `${baseConfig.baseURL}${endpoint}`;  // if false: combine base + endpoint
    return fetchFromURL(url);
  };

  return {
    fetch: fetchFromEndpoint,
  };
};

function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const discogsAPI = dataFetcher(queryConfig);

const getRandomData = async () => {
  const searchTypes = ["artist", "master", "release"];
  const searchType = getRandomItem(searchTypes);
  const randomPageNumber = getRandomNumber(1, 100);
  const query = `/database/search?&type=${searchType}&key=${queryConfig.key}&secret=${queryConfig.secret}&page=${randomPageNumber}&per_page=1`;
  const data = await discogsAPI.fetch(query);
  return data?.results || [];
};

const getSearchedArtist = async (trackTitle = "", artistName = "") => {
  const query = `/database/search?q=${encodeURIComponent(
    trackTitle
  )}+${encodeURIComponent(artistName)}&key=${queryConfig.key}&secret=${
    queryConfig.secret
  }&page=1&per_page=1`;
  const data = await discogsAPI.fetch(query);
  return data?.results || [];
};

const initialReleaseDisplay = (data) => {
  return `<li class="results-item">Release Title: ${
    data.title || "Unknown"
  }</li>
  <li class="results-item">Release Year: ${data.year || "Unknown"}</li>
  <li class="results-item">Genre: ${data.genre || "Unknown"}</li>
  <li class="results-item">Label: ${data.label[0] || "Unknown"}</li>
  <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />`;
};
const initialArtistDisplay = (data) => {
  return `<li class="results-item">Artist name: ${data.title || "Unknown"}</li>
  <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />`;
};


const displayHandlers = {
  master: initialReleaseDisplay,
  release: initialReleaseDisplay,
  artist: initialArtistDisplay,
};

const createMoreInfoButton = (index, resourceUrl) => `
  <button class="more-info secondary-button" data-index="${index}" data-url="${resourceUrl}">
    More info
  </button>
`;

const displayTrackInfo = async (dataArray, input) => {
  const resultsList = document.getElementById("resultsList");
  const resultsHeading = document.getElementById("resultsHeading");
  resultsList.innerHTML = "";
  resultsHeading.textContent = `Your search results ${input}`;

  let resultsHTML = "";
  dataArray.forEach((data, index) => {
    const displayHandler =
      displayHandlers[data.type] ||
      (() => `<li class="results-item">No relevant data</li>`);

    resultsHTML += `
    <div class="result-item">
      ${displayHandler(data)}
      ${createMoreInfoButton(index, data.resource_url)}
    </div>
  `;

    resultsList.innerHTML = resultsHTML;
    document.querySelectorAll(".more-info").forEach((button) => {
      button.addEventListener("click", getMoreInfo);
    });
  });
  console.log(dataArray)
};

const getMoreInfo = async (e) => {
  const resourceUrl = e.target.getAttribute("data-url");
  if (resourceUrl) {
    const detailedData = await discogsAPI.fetch(resourceUrl);
    console.log("Detailed Data:", detailedData);
    displayMoreInfo(e.target, detailedData);
  } else {
    console.log("No additional resource available.");
  }
};

const displayMoreInfo = (button, info) => {
  const trackList = info.tracklist.map(listing => {
    return {
      "Track Number": listing.position,
      "Track Title": listing.title,
      "Track duration": listing.duration
    }
  })
  console.log(trackList);

  for (let i = 0; i < trackList.length; i++) {
    const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("detailed-info");
  detailsDiv.innerHTML = `
    
    <h3><strong>Track number:</strong> ${trackList[i]["Track Number"]}</h3>
    <p><strong>Track name:</strong> ${trackList[i]["Track Title"]}</p>
    <p><strong>Track duration:</strong> ${trackList[i]["Track duration"] || 'No duration provided'}</p>
  `;
  button.parentNode.appendChild(detailsDiv);
  }

  

  
};

const renderRandomData = async (e) => {
  e.preventDefault();
  const randomItem = await getRandomData();
  console.log(randomItem);
  return displayTrackInfo(randomItem, "");
};

const renderSearchedData = async (e) => {
  e.preventDefault();
  const artistName = artistInput.value.trim();
  const trackTitle = trackInput.value.trim();
  const searchedItem = await getSearchedArtist(trackTitle, artistName);
  const trackAndArtist = `${trackTitle} by ${artistName} `;
  return displayTrackInfo(searchedItem, trackAndArtist);
};

randomButton.addEventListener("click", renderRandomData);
searchButton.addEventListener("click", renderSearchedData);
