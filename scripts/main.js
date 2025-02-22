const apiKey = 'jIsWwEpLHMbcjqlQQSea';
const input = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

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

const discogsAPI = dataFetcher(queryConfig);


const getInitialArtistData = async (userInput) => {
  const query = `/database/search?q=${encodeURIComponent(userInput)}&key=${queryConfig.key}&secret=${
    queryConfig.secret
  }&page=1&per_page=1`;
  const data = await discogsAPI.fetch(query);
  return data?.results || [];
};

const getMasterReleaseData = async () => {
  const search = await getInitialArtistData('Hysteria Muse');
  const releaseUrl = `${search[0].master_url}?page=1&per_page=1`;
  const releaseData = await discogsAPI.fetch(releaseUrl);
  console.log(releaseData)
  return releaseData
}

const getArtistResourceURL = async () => {
  const data = await getMasterReleaseData();
  const artistArray = data.artists;
  return await discogsAPI.fetch(artistArray[0].resource_url)

}

const getArtistName = async (data) => {
  return data.name;
}



const getTrackTitle = async (data) => {
  const track = data.tracklist.find(track => track.title === data.title);
  return track.title
}


const getAlbumTitle = async (data) => {
  return data.title;
}

const getAlbumReleaseYear = async (data) => {
  return data.year;
}


const init = async() => {
  const mainDataStructure = await getMasterReleaseData();
  const trackTitle = await getTrackTitle(mainDataStructure);
  const artistResource = await getArtistResourceURL();
  const artistName = await getArtistName(artistResource);
  const albumTitle = await getAlbumTitle(mainDataStructure);
  const releaseYear = await getAlbumReleaseYear(mainDataStructure);

  console.log(
    `${trackTitle},
    ${artistName},
    ${albumTitle},
    ${releaseYear}`)
}

init();








//searchButton.addEventListener('click', renderData);







































/* const getRandomData = async () => {
  const searchTypes = ["artist", "master", "release"];
  const searchType = getRandomItem(searchTypes);
  const randomPageNumber = getRandomNumber(1, 100);
  const query = `/database/search?&type=${searchType}&key=${queryConfig.key}&secret=${queryConfig.secret}&page=${randomPageNumber}&per_page=1`;
  const data = await discogsAPI.fetch(query);
  return data?.results || [];
}; */




//randomButton.addEventListener("click", renderRandomData);



/* const renderRandomData = async (e) => {
  e.preventDefault();
  const randomItem = await getRandomData();
  console.log(randomItem);
  return displayTrackInfo(randomItem, "");
}; */