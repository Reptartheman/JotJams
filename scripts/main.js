const apiKey = 'jIsWwEpLHMbcjqlQQSea';
const input = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const queryHandlers = {
  trackTitle: 'track title',
  artist: 'artist',
  album: 'release_title',
  year: 'year'
}

const getQueryType = (queryType) => queryHandlers[queryType] || 'Unable to find this';

const fetchRelevantData = async (searchInput, apiKey) => {
  const queryType = document.getElementById('dropDown').value; 
  const query = `https://api.discogs.com/database/search?q=${encodeURIComponent(searchInput)}&type=${queryType}&key=${apiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=1&per_page=3`;

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
    })
};
//if the users search option is to search by artist, then the user will be presented with the cover image with the resource_url attached to it so that the user can see more...

const displayArtistInfo = (dataArray, input) => {
  const resultsList = document.getElementById('resultsList');
  const resultsHeading = document.getElementById('resultsHeading');
  resultsList.innerHTML = '';
  resultsHeading.innerHTML = `You searched for: ${input}`;
  

  dataArray.forEach((data) => {
    const item = document.createElement('li');
    item.classList.add('data-item');
    item.id = 'dataItem';
    item.innerHTML = `
    <a href="${data.resource_url}">
       <img src="${data.cover_image}" alt="cover">
    </a>
   `;
    resultsList.appendChild(item);
  });
};

const renderData = async () => {
  const searchInput = input.value.trim();
  const allData = await fetchRelevantData(searchInput, apiKey);
  console.log(allData);
  if (allData) {
    displayArtistInfo(allData, searchInput);
  }
}


searchButton.addEventListener('click', renderData);