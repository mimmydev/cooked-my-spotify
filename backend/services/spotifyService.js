export const parseSpotifyUrl = (url) => {
  const regex = /spotify\.com\/playlist\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return {
    isValid: !!match,
    playlistId: match?.[1] || null,
    playlistName: `playlist_${match?.[1]?.slice(0, 8)}`,
  };
};
