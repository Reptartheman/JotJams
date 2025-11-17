const queryConfig = {
  baseURL: "https://api.discogs.com",
  key: import.meta.env.VITE_API_KEY,
  secret: import.meta.env.VITE_API_SECRET,
};

const buildURL = (baseURL, endpoint) => {
  const cleaned = endpoint.trim();
  return cleaned.startsWith("http") ? cleaned : `${baseURL}${cleaned}`;
};

const fetchFromEndpoint = (baseURL) => async (endpoint) => {
  if (typeof endpoint !== "string" || !endpoint.trim()) {
    throw new Error("Invalid endpoint provided to Discogs API client.");
  }

  const url = buildURL(baseURL, endpoint);
  return fetchFromURL(url);
};

const fetchFromURL = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Discogs request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    alert("For desired results please search the song name AND artist name");
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
  }&secret=${queryConfig.secret}&page=1&per_page=5`;
  const data = await discogsAPIData(query);
  const results = data?.results || [];

  if (results.length === 0) {
    throw new Error("No results found for that search term.");
  }

  return results;
};

export const dataFromMasterReleaseURL = async (releaseData) => {
  const data = await discogsAPIData(releaseData);
  if (!data) return null;

  return {
    title: data?.title,
    artist: data?.artists?.[0]?.name,
    album: data?.title,
    year: data?.year,
    genre: data?.genres,
    style: data?.styles,
    trackData: data?.tracklist,
    artistResourceUrl: data?.artists?.[0]?.resource_url,
    mainReleaseData: data?.main_release_url,
    recentReleaseData: data?.most_recent_release_url,
    versions: data?.versions_url,
  };
};
