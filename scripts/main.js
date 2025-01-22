const apiKey = 'jIsWwEpLHMbcjqlQQSea';
const input = document.getElementById('searchInput');
const artistInput = document.getElementById('artistInput');
const trackInput = document.getElementById('trackInput');
const resultsHeading = document.getElementById('resultsHeading');
const queryList = ['type','title','release_title','artist', 'label' ,'genre' ,'style','track'];



async function init() {
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomQuery = getRandomItem(queryList);
  console.log(`Random Query Type: ${randomQuery}`);
  const query = `https://api.discogs.com/database/search?&type=${randomQuery}&key=${apiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=1&per_page=100`;
  
  return fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(data => console.log(data.results))
    .catch(err => {
      console.error('Error fetching data:', err);
      return null;
    });

}



const fetchRelevantData = async (trackTitle, artistName) => {
  const query = `https://api.discogs.com/database/search?q=${encodeURIComponent(trackTitle)}+${encodeURIComponent(artistName)}&type=master&key=${apiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=1&per_page=3`;

  return fetch(query)
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
    });
};



//if the users search option is to search by artist, then the user will be presented with the cover image with the resource_url attached to it so that the user can see more...

const displayTrackInfo = (dataArray, input) => {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = ''; // Clear previous results
  resultsHeading.textContent = '';
    if (input !== null) {
      resultsHeading.textContent = `You searched for ${input}`;
    }
  dataArray.forEach((data, index) => {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track-card');
    trackElement.innerHTML = `
      <li class="results-item" id="${index}"> Album: ${data.title || 'Unknown'} </li>
     <li class="results-item" id="${index}"> Genre: ${data.genre ? data.genre.join(', ') : 'Unknown'} </li>
     <li class="results-item" id="${index}"> Year: ${data.year || 'Unknown'} </li>
      <img src="${data.thumb}" alt="Track Thumbnail" />
    `;
    resultsContainer.appendChild(trackElement);
  });
};


const renderData = async (e) => {
  e.preventDefault();
  const artistName = artistInput.value.trim();
  const trackTitle = trackInput.value.trim();
  const trackAndArtist = `${trackTitle} by ${artistName} `;
  const trackData = await fetchRelevantData(artistName, trackTitle);
  console.log(trackData);

  if (!artistName || !trackTitle) {
    
    console.error('Both artist name and track title are required.');
    return;
  }

  

  if (trackData && trackData.length > 0) {
    displayTrackInfo(trackData, trackAndArtist);
  } else {
    console.log('No results found.');
  }
}



await init();

searchButton.addEventListener('click', renderData);

