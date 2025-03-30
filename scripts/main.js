const input = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const queryConfig = {
  baseURL: "https://api.discogs.com",
  key: "jIsWwEpLHMbcjqlQQSea",
  secret: "cUgaJgZJhrLgLKxattfmUZscPaUBDrcF",
};



const buildURL = (baseURL, endpoint) => {
  return endpoint.startsWith("http") ? endpoint : `${baseURL}${endpoint}`;
};


const fetchFromEndpoint = (baseURL) => async (endpoint) => {
  const url = buildURL(baseURL, endpoint);
  return fetchFromURL(url);
};

const fetchFromURL = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
};


const dataFetcher = (baseConfig) => {
  return fetchFromEndpoint(baseConfig.baseURL);
};

const returnPromises = (...promises) => Promise.all(promises);

const discogsAPIData = dataFetcher(queryConfig);


const getInitialArtistData = async (userInput) => {
  const query = `/database/search?q=${encodeURIComponent(userInput)}&key=${
    queryConfig.key
  }&secret=${queryConfig.secret}&page=1&per_page=1`;
  const data = await discogsAPIData(query);
  console.log(data?.results);
  return data?.results || [];
};

const getMasterReleaseData = async (input) => {
  const search = await getInitialArtistData(input);
  const releaseUrl = `${search[0].master_url}?page=1&per_page=1`;
  const releaseData = await discogsAPIData(releaseUrl);
  return releaseData;
};

const getImages = async (input) => {
  const data = await getInitialArtistData(input);
  return {
    coverImage: data[0]?.cover_image || null,
    thumbNail: data[0]?.thumb || null
  };
};


const getArtistResourceURL = async (input) => {
  const data = await getMasterReleaseData(input);
  const artistArray = data.artists;
  return await discogsAPIData(artistArray[0].resource_url);
};

const getArtistName = async (data) => {
  return data.name;
};

const getTrackTitle = async (data) => {
  const track = data.tracklist.find((track) => track.title === data.title);
  return track.title;
};

const getAlbumTitle = async (data) => {
  return data.title;
};

const getAlbumReleaseYear = async (data) => {
  return data.year;
};

const buildDisplay = (input, info) => {
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "";
  resultsHeading.textContent = `Your search results: ${input}`;

  const trackElement = document.createElement("div");
  trackElement.classList.add("track-card");
  trackElement.innerHTML = `
  <div class="track-info">
    <li class="results-item">Track Title: ${info.trackTitle || "Unknown"}</li>
    <li class="results-item">Artist: ${info.artistName || "Unknown"}</li>
    <li class="results-item">Album: ${info.albumTitle || "Unknown"}</li>
    <li class="results-item">Release Year: ${info.releaseYear || "Unknown"}</li>
  </div>
  <div class="track-image">
    <img src="${info.coverImage}" alt="Cover Image" class="cover-img" />
  </div>
`;

  resultsContainer.appendChild(trackElement);
}



const renderSearchedData = async (e) => {
  e.preventDefault();
  const searchInput = input.value.trim();

  const [mainDataStructure, artistResource] = await returnPromises(getMasterReleaseData(searchInput), getArtistResourceURL(searchInput));


  const [
    trackTitle,
    artistName,
    albumTitle,
    releaseYear,
    albumArt
  ] = await returnPromises(getTrackTitle(mainDataStructure), getArtistName(artistResource), 
  getAlbumTitle(mainDataStructure), getAlbumReleaseYear(mainDataStructure), getImages(searchInput));

  const display = buildDisplay(searchInput, {
    trackTitle, 
    artistName, 
    albumTitle, 
    releaseYear,
    coverImage: albumArt.coverImage
  });
  
  return display;  
};

searchButton.addEventListener("click", renderSearchedData);



