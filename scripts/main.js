import { initialDataFetch, dataFromMasterReleaseURL } from "./api";

import { 
  getMasterUrl, 
  getImages, 
  getPrimaryData, 
  getSecondaryData, 
  getAllOtherUrls, 
  getMoreInfo 
} from "./data";

import { buildInitialDisplay, displaySecondaryData } from "./dom";


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





/* const mainRelease = await discogsAPIData(
"https://api.discogs.com/releases/377153") */
//const recent = await discogsAPIData("https://api.discogs.com/releases/13729613")
/* const versions = await discogsAPIData(
  "https://api.discogs.com/masters/92068/versions"
) */
//const member = await discogsAPIData('https://api.discogs.com/artists/382230')

//console.log(mainRelease)
//console.log(recent)
//console.log(versions)
//console.log(member)