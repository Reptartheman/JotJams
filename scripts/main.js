const apiKey = 'jIsWwEpLHMbcjqlQQSea';
const input = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

//look into parameterize queries
//https://api.discogs.com/database/search?q=Nirvana&type=artist&key=API_KEY&secret=API_SECRET


const fetchRelevantData = async (searchInput, apiKey) => {
  const baseUrl = 'https://api.discogs.com/database/search?q=';
  const queryType = document.getElementById('dropDown').value; 
  const query = `${encodeURIComponent(searchInput)}&type=${queryType}&key=${apiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=1&per_page=30`;

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


const displayArtistInfo = (dataArray, input) => {
  const resultsList = document.getElementById('resultsList');
  const resultsHeading = document.getElementById('resultsHeading');
  resultsList.innerHTML = '';
  resultsHeading.innerHTML = `You searched for: ${input}`;

  dataArray.forEach((data) => {
    resultsList.innerHTML = ` 
      <li id="artist">Can be listened to on: ${data.title || 'Unknown album'}</li>
      <li id="artist">Genre: ${data.genre || 'Unknown genre'}</li>
      <li id="type">Release type: ${data.type || 'Unknown release'}</li>
      <li id="year">Release year: ${data.year || 'Unknown year'}</li>
        <div class="album-image-container">
              <img src="${data.cover_image}" alt="album cover">
        </div>
    `
  });
};


searchButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const searchInput = input.value.trim();
  const artistData = await fetchRelevantData(searchInput, apiKey);
  console.log(artistData);
  if (artistData) {
    displayArtistInfo(artistData, searchInput);
  }
});