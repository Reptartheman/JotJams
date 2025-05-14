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


export const getPrimaryData = ({ title, artist, year }) => ({
  title,
  artist,
  album: title,
  year,
});

export const getSecondaryData = ({ genre, style, trackData }) => ({
  genre,
  style,
  trackData,
});

export const getAllOtherUrls = ({ artistResourceUrl, mainReleaseData, recentReleaseData, versions }) => ({
  artistResourceUrl,
  mainReleaseData,
  recentReleaseData,
  versions,
});


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