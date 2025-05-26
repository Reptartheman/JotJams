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


export const discogsAPIData = dataFetcher(queryConfig);


export const initialDataFetch = async (userInput) => {
  const query = `/database/search?q=${encodeURIComponent(userInput)}&key=${
    queryConfig.key
  }&secret=${queryConfig.secret}&page=1&per_page=16`;
  const data = await discogsAPIData(query);
  const results = data?.results || [];

  if (results.length === 0) {
    throw new Error("No results found for that search term.");
  }
  console.log(results);
  return results;
};

export const dataFromMasterReleaseURL = async (releaseData) => {
  const data = await discogsAPIData(releaseData);
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
  return updatedData;
};

/* const versions = await discogsAPIData(
  "https://api.discogs.com/masters/92068/versions"
)

console.log(versions)

const mainRelease = await discogsAPIData(
"https://api.discogs.com/releases/377153")

console.log(mainRelease)

const recent = await discogsAPIData("https://api.discogs.com/releases/13729613")

const member = await discogsAPIData('https://api.discogs.com/artists/382230')


console.log(recent)
console.log(member) */



