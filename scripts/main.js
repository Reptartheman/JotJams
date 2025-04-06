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

const initialDataFetch = async (userInput) => {
  const query = `/database/search?q=${encodeURIComponent(userInput)}&key=${
    queryConfig.key
  }&secret=${queryConfig.secret}&page=1&per_page=1`;
  const data = await discogsAPIData(query);
  const results = data?.results || [];

  if (results.length === 0) {
    throw new Error("No results found for that search term.");
  }
  console.log(results);
  return results;
};

const getMasterUrl = (initialData) => {
  const masterUrl = `${initialData[0].master_url}?page=1&per_page=1`;
  return masterUrl;
};
const dataFromMasterReleaseURL = async (releaseData) => {
  const data = await discogsAPIData(releaseData);
  console.log(data);
  const updatedData = {
    title: data.title,
    artist: data.artists[0].name,
    album: data.title,
    year: data.year,
    artistResourceUrl: data.artists[0].resource_url,
    genre: data.genres,
    trackOrder: data.tracklist,
    mainReleaseData: data.main_release_url,
    recentReleaseData: data.most_recent_release_url,
    versions: data.versions_url,
  };
  console.log(updatedData);
  return updatedData;
};

const getSecondaryURLs = (updatedData) => {
  const { artistResourceUrl, mainReleaseData, recentReleaseData, versions } =
    updatedData;

  return {
    artistResourceUrl,
    mainReleaseData,
    recentReleaseData,
    versions,
  };
};

const getImages = (initialData) => {
  return {
    coverImage: initialData[0]?.cover_image || null,
    thumbNail: initialData[0]?.thumb || null,
  };
};


const buildInitialDisplay = (input, data) => {
  const resultsList = document.getElementById("resultsList");
  const resultsHeading = document.getElementById("resultsHeading");
  const coverImage = document.querySelector(".cover-img");
  resultsHeading.textContent = `You searched: ${input}`
  resultsList.classList.toggle("active");

  const trackTitle = document.getElementById("trackTitle");
  trackTitle.textContent = `Track Title: ${data.title || "Unknown"}`;
  
  const artist = document.getElementById("artist")
  artist.textContent = `Artist: ${data.artist || "Unknown"}`;

  const album = document.getElementById("album");
  album.textContent = `Album: ${data.album || "Unknown"}`;

  const releaseYear = document.getElementById("releaseYear");
  releaseYear.textContent = `Release Year: ${data.year || "Unknown"}`;

  coverImage.src = `${data.coverImage}` 
};

const createTrackListingButton = (trackOrder) => {
  const button = document.createElement("button");
  button.classList.add("more-info", "secondary-button");
  button.textContent = "Show tracklisting";
  button.addEventListener("click", () => getTrackListing(trackOrder));
  return button;
};

const getTrackListing = (trackOrder) => {
  const container = document.createElement("div");
  container.classList.add("detailed-info");

  trackOrder.forEach((track) => {
    const trackDiv = document.createElement("div");
    trackDiv.innerHTML = `
      <p><strong>${track.position}:</strong> ${track.title} — ${track.duration}</p>
    `;
    container.appendChild(trackDiv);
  });
  document.querySelector(".track-card").appendChild(container);
};

const createMoreInfoButton = (artistResourceUrl) => {
  return `<button class="more-info secondary-button" data-url="${artistResourceUrl}">Show tracklisting</button>`;
};

/* const getMoreInfo = async (e) => {
  const artistResourceUrl = e.target.getAttribute("data-url");
  if (artistResourceUrl) {
    const detailedData = await discogsAPIData(artistResourceUrl);
    console.log(detailedData);
    const trackOrderData = trackOrderData()
    displayMoreInfo(e.target, detailedData);
  } else {
    console.log("No additional resource available.");
  }
}; */

const displayMoreInfo = (button, info) => {
  const { members, profile } = info;
  const membersDisplay = members.forEach((member, index) => {
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("detailed-info");

    detailsDiv.innerHTML = `
    <p><strong>${index + 1}:</strong> ${
      member.name || "No duration provided"
    }</p>
  `;
    button.parentNode.appendChild(detailsDiv);
  });
};

const renderSearchedData = async (e) => {
  e.preventDefault();
  const searchInput = input.value.trim();
  const initialData = await initialDataFetch(searchInput);
  const masterUrl = getMasterUrl(initialData);
  const imageSources = getImages(initialData);

  const mainData = await dataFromMasterReleaseURL(masterUrl);
  const { title, artist, album, year, trackOrder } = mainData;

  const display = buildInitialDisplay(searchInput, {
    title,
    artist,
    album,
    year,
    coverImage: imageSources.coverImage,
    trackOrder,
  });

  return display;
};

searchButton.addEventListener("click", renderSearchedData);



/* 
NEXT TIME:

- get the member data, genre, style in a more info btn
- sort and favorite functions


*/
