export const getMasterUrl = (initialData) => {
  if (!Array.isArray(initialData) || initialData.length === 0) {
    return null;
  }

  const masterEntry = initialData.find((item) => {
    const url = typeof item?.master_url === "string" ? item.master_url.trim() : "";
    return Boolean(url);
  });

  if (masterEntry?.master_url) {
    const trimmed = masterEntry.master_url.trim();
    return trimmed.includes("?") ? trimmed : `${trimmed}?page=1&per_page=1`;
  }

  const fallbackEntry = initialData.find((item) => {
    const url = typeof item?.resource_url === "string" ? item.resource_url.trim() : "";
    return Boolean(url);
  });

  return fallbackEntry?.resource_url?.trim() || null;
};

export const getImages = (initialData = []) => {
  return {
    coverImage: initialData[0]?.cover_image || null,
    thumbNail: initialData[0]?.thumb || null,
  };
};

export const getPrimaryData = (data = {}) => {
  const { title, artist, year } = data;
  return {
    title,
    artist,
    album: title,
    year,
  };
};

export const getAllOtherUrls = ({
  artistResourceUrl,
  mainReleaseData,
  recentReleaseData,
  versions,
} = {}) => ({
  artistResourceUrl,
  mainReleaseData,
  recentReleaseData,
  versions,
});

export const transFormTrackData = (trackData = []) => {
  return trackData.map((track) => ({
    position: track.position,
    title: track.title,
    duration: track.duration,
  }));
};
