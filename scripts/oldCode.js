const discCogsapiKey = 'jIsWwEpLHMbcjqlQQSea';
const input = document.getElementById('searchInput');
const artistInput = document.getElementById('artistInput');
const trackInput = document.getElementById('trackInput');
const searchButton = document.getElementById('searchButton');
const randomButton = document.getElementById('randomSearchButton');
const resultsHeading = document.getElementById('resultsHeading');
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

const fetchData = async (query) => {
  return fetch(query)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(data => data)
    .catch(err => {
      console.error('Error fetching data:', err);
      return null;
    });
}
/* 
  The fetchData function turned into the dataFetcher function after tinkering with a FetchWrapper class, which I learned from Learn JavaScript.online.
  I switched it after prompting chat GPT and Claude to provide me with more refactoring options. 
  The dataFetcher function is what Claude gave me because it made more sense to me rather than what ChatGPT gave me, which I don't have anymore because I deleted the chat.
*/

const getRandomData = async () => {
  const randomPageNumber = getRandomNumber(1, 100);
  const randomQuery = `https://api.discogs.com/database/search?&type=artist&key=${discCogsapiKey}&secret=cUgaJgZJhrLgLKxattfmUZscPaUBDrcF&page=${randomPageNumber}&per_page=1`;
  const data = await fetchData(randomQuery);
  const dataMapped = data.results.map(item => {
    return {
      name: item.title,
      id: item.id,
      resource: item.resource_url,
      thumb: item.thumb
    }
  })
  console.log(data)
  return dataMapped;
}

/* 
  getRandomData was originally creating a problem when fetching the resource_url which is used to get additional data attached to the 'More info' button.
  the base url would get concatenated with the query, resulting in the base url being in the full url two times, resulting in an error. That's why we put the fetchFromEndPoint method inside of the dataFetcher function. The fetchFromEndPoint takes endpoint as a parameter, inside the method we declare a URL variable which holds a ternary operator and says, if the endPoint starts with the string "http" then search from that endpoint otherwise concatenate the endpoint with the baseURL
*/

const displayTypes = {
  masterOrRelease: 'master' || 'release',
  artist: 'artist',
  label: 'label',
}

const getDisplayType = (displayType) => displayTypes[displayType] || 'No relevant data';

const displayTrackInfoOG = async (dataArray, input) => {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = '';
  resultsHeading.textContent = `Your search results ${input}`;
  dataArray.forEach((data, index) => {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track-card');
    trackElement.innerHTML = `
      <li class="results-item" id="${index}">Artist: ${data.name || 'Unknown'}</li>
      <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />
      <button id="moreInfo" class="more-info-btn" data-release-id="${getMoreInfo(data.resource)}">More Info</button>
    `;
    resultsContainer.appendChild(trackElement);
  });
};


const displayTrackInfoUpdate = async (dataArray, input) => {
  const resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = "";
  resultsHeading.textContent = `Your search results ${input}`;
  dataArray.forEach((data, index) => {
    const displayType = data.type;
    const releaseDisplay = initialReleaseDisplay(data)
    const artistDisplay = initialArtistDisplay(data)
    const labelDisplay = initialLabelDisplay(data)
    if (displayType === 'master' || 'release') {
      resultsList.innerHTML = `${releaseDisplay}`
       `<button id="moreInfo" class="secondary-button" data-index="${index}" data-url="${data.resource_url}">
        More info
      </button>`
    } 

    if (displayType === 'artist') {
      resultsList.innerHTML = `${artistDisplay}`
       `<button id="moreInfo" class="secondary-button" data-index="${index}" data-url="${data.resource_url}">
        More info
      </button>`
    }

    if (displayType === 'label') {
      resultsList.innerHTML = `${labelDisplay}`
       `<button id="moreInfo" class="secondary-button" data-index="${index}" data-url="${data.resource_url}">
        More info
      </button>`
    }
  });
  document.getElementById("moreInfo").addEventListener("click", getMoreInfo);
};

const initialReleaseDisplay = (data) => {
  return `<li class="results-item">Release Title: ${data.title || "Unknown"}</li>
  <li class="results-item">Release Year: ${data.year || "Unknown"}</li>
  <li class="results-item">Genre: ${data.genre || "Unknown"}</li>
  <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />`
}
const initialArtistDisplay = (data) => {
  return `<li class="results-item">Artist name: ${data.title || "Unknown"}</li>
  <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />`
}
const initialLabelDisplay = (data) => {
  return `<li class="results-item">Label name: ${data.title || "Unknown"}</li>
  <img src="${data.thumb || data.cover_image}" alt="Track Thumbnail" />`
}

const getMoreInfo = async (resourceLink) => {
     
  try {
    const detailedInfo = await fetch(`${resourceLink}`)
      .then(response => response.json());
    console.log(detailedInfo);
  } catch (error) {
    console.error('Error fetching detailed info:', error);
  }
};

const displayMoreInfo = (button, info) => {
  const artistDescription = info.profile || "No additional info available";
  const full = info.realname || "Unknown";
  
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("detailed-info");
  detailsDiv.innerHTML = 
    `<h3>Additional details</h3>
    <p><strong>Full name:</strong> ${full}</p>
    <p><strong>Profile:</strong> ${artistDescription}</p>`
  ;

  button.parentNode.appendChild(detailsDiv);
};

const renderRandomData = async (e) => {
  e.preventDefault();
  const randomItem = await getRandomArtist();
  console.log(randomItem);
  return displayTrackInfo(randomItem, "");
};

const renderSearchedData = async (e) => {
  e.preventDefault();
  const artistName = artistInput.value.trim();
  const trackTitle = trackInput.value.trim();
  const searchedItem = await getSearchedArtist(trackTitle, artistName);
  const trackAndArtist = `${trackTitle} by ${artistName}` ;
  return displayTrackInfo(searchedItem, trackAndArtist);
};



randomButton.addEventListener("click", renderRandomData);
searchButton.addEventListener("click", renderSearchedData);