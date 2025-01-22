const apiKey = 'jIsWwEpLHMbcjqlQQSea';
const input = document.getElementById('searchInput');
const artistInput = document.getElementById('artistInput');
const trackInput = document.getElementById('trackInput');
const resultsHeading = document.getElementById('resultsHeading');
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];



async function fetchRandomData(random) {

  return fetch(random)
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
}




const init = async () => {
  const queryList = ['release','artist', 'label','master'];
  const randomQueryType = getRandomItem(queryList);
  const query = `https://api.discogs.com/database/search?&type=${randomQueryType}&key=${apiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=7&per_page=100`;
  const data = await fetchRandomData(query);
  //console.log(data);
  return data;
}

init().then(results => console.log(results));

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
  resultsHeading.textContent = `You searched for ${input}`;
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





searchButton.addEventListener('click', renderData);

