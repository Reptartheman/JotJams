const apiKey = 'jIsWwEpLHMbcjqlQQSea';
const input = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');

const queryMap = {
  trackName: 'track',
  artistName: 'artist',
  albumTitle: 'release_title',
  releaseYear: 'year',
  
}

const fetchRelevantData = async (searchInput, apiKey) => {
  const baseUrl = 'https://api.discogs.com/database/search';
  const query = `?q=${encodeURIComponent(searchInput)}&key=${apiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=50&per_page=3`;

  return fetch(`${baseUrl}${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(data => data.results)
    .catch(err => {
      console.error('Error fetching data:', err);
      return null;
    })
};


const displayArtistInfo = (data) => {
  const displayMap = {
    title: (title) => `${title}`,
    type: (type) => `The release type is ${type}`,
    release_Year: (year) => `Released in: ${year}`
  };

  Object.entries(data).forEach(([key, value]) => {
    const element = document.getElementById(key);
    if (element) {
      element.innerHTML = displayMap[key](value);
    }
  });
};


searchButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const searchInput = input.value.trim();
  const artistData = await fetchRelevantData(searchInput, apiKey);
  for (const elem of artistData) {
    return { title, type, year} = elem;
  }
  if (artistData) {
    displayArtistInfo({
      title: artistData.title,
      type: artistData.type,
      release_Year: artistData.year
    });
  }
});
