import { discogsAPIData } from "./api";
import { displayMoreInfo } from "./dom";

export const getMasterUrl = (initialData) => {
  const masterUrl = `${initialData[0].master_url}?page=1&per_page=1`;
  return masterUrl;
};

export const getImages = (initialData) => {
  return {
    coverImage: initialData[0]?.cover_image || null,
    thumbNail: initialData[0]?.thumb || null,
  };
};


export const getPrimaryData = (data) => ({
  title: data.title,
  artist: data.artist,
  album: data.title,
  year: data.year,
});

export const getSecondaryData = (data) => ({
  genre: data.genre,
  style: data.style,
  trackData: data.trackData,
});

export const getAllOtherUrls = (data) => ({
  artistResourceUrl: data.artistResourceUrl,
  mainReleaseData: data.mainReleaseData,
  recentReleaseData: data.recentReleaseData,
  versions: data.versions,
});//destruture data instead

export const getMoreInfo = async (links) => {
  const detailedData = await discogsAPIData(links);
  console.log(detailedData);
  displayMoreInfo(detailedData);
};

export const transFormTrackData = (trackData) => {
  const tracks = trackData.map(track => {
    return {
      position: track.position,
      title: track.title,
      duration: track.duration,
    }
  })

  return tracks;
};