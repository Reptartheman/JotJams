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
"description"];

elementsWithIds.forEach(element => window[element] = document.getElementById(element));

const returnPromises = (...promises) => Promise.all(promises);

const shortenProfileDescription = (text, limit = 245) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

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
  console.log(`I am initial data fetch`);
  console.log(results);
  return results;
};

const getMasterUrl = (initialData) => {
  const masterUrl = `${initialData[0].master_url}?page=1&per_page=1`;
  return masterUrl;
};

const getImages = (initialData) => {
  return {
    coverImage: initialData[0]?.cover_image || null,
    thumbNail: initialData[0]?.thumb || null,
  };
};

const dataFromMasterReleaseURL = async (releaseData) => {
  const data = await discogsAPIData(releaseData);
  console.log(`I am master release`);
  console.log(data);
  const updatedData = {
    title: data?.title,
    artist: data?.artists[0].name,
    album: data?.title,
    year: data?.year,
    genre: data?.genres,
    style: data?.styles,
    trackData: data?.tracklist,
    artistResourceUrl: data?.artists[0].resource_url,
    mainReleaseData: data?.main_release_url,
    recentReleaseData: data?.most_recent_release_url,
    versions: data?.versions_url,
  };
  console.log(`I am updatedData`);
  console.log(updatedData);
  return updatedData;
};

const getPrimaryData = (data) => ({
  title: data.title,
  artist: data.artist,
  album: data.title,
  year: data.year,
});

const getSecondaryData = (data) => ({
  genre: data.genre,
  style: data.style,
  trackData: data.trackData,
});

const getAllOtherUrls = (data) => ({
  artistResourceUrl: data.artistResourceUrl,
  mainReleaseData: data.mainReleaseData,
  recentReleaseData: data.recentReleaseData,
  versions: data.versions,
});

const createElementUtil = (elem) => document.createElement(elem);

const transFormTrackData = (trackData) => {
  const tracks = trackData.map(track => {
    return {
      position: track.position,
      title: track.title,
      duration: track.duration,
    }
  })

  return tracks;
}

const displaySecondaryData = async (trackData, ...data) => {
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




const buildInitialDisplay = (input, data) => {
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


const getMoreInfo = async (links) => {
    const detailedData = await discogsAPIData(links);
    console.log(detailedData);
    displayMoreInfo(detailedData);
};



const displayMoreInfo = (data) => {
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

const displayInitialSearch = async (e) => {
  e.preventDefault();
  const input = searchInput.value.trim();
  const initialData = await initialDataFetch(input);
  const masterUrl = getMasterUrl(initialData);
  const imageSources = getImages(initialData);
  const mainData = await dataFromMasterReleaseURL(masterUrl);
  const primary = getPrimaryData(mainData);
  const secondary = getSecondaryData(mainData);
  const links = getAllOtherUrls(mainData);
  console.log(secondary);

  const display = buildInitialDisplay(input, {
    ...primary,
    coverImage: imageSources.coverImage
  });
  trackListingBtn.addEventListener("click", () => {
    displaySecondaryData(secondary.trackData, secondary);
  });

  moreInfoBtn.addEventListener("click", async () => {
    getMoreInfo(links.artistResourceUrl);
  });
  return display;
};

searchButton.addEventListener("click", displayInitialSearch);




/* 
NEXT TIME:
- sort and favorite functions
*/





const mainRelease = await discogsAPIData(
"https://api.discogs.com/releases/377153")
const recent = await discogsAPIData("https://api.discogs.com/releases/13729613")
/* const versions = await discogsAPIData(
  "https://api.discogs.com/masters/92068/versions"
) */
//const member = await discogsAPIData('https://api.discogs.com/artists/382230')

//console.log(mainRelease)
//console.log(recent)
//console.log(versions)
//console.log(member)