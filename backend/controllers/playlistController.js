const { getSpotifyToken } = require("../utils/spotifyTokenUtil");

async function getPlaylistSongs(req, res, next) {
  try {
    const spotifyToken = `Bearer ${await getSpotifyToken(req)}`;
    const playlistId = req.params.playlistId;
    const songsData = { songs: [] };

    let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    do {
      const response = await fetch(nextUrl, {
        headers: {
          Authorization: spotifyToken,
        },
      });
      const json = await response.json();
      nextUrl = json.next;

      for (const song of json.items) {
        songsData.songs.push({
          name: song.track.name,
          artist: song.track.artists[0].name,
          duration: formatMs(song.track.duration_ms),
        });
      }
    } while (nextUrl);

    res.json(songsData);
  } catch (e) {
    next(e);
  }
}

function formatMs(duration) {
  let seconds = duration / 1000;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds - minutes * 60);
  if (seconds < 10) {
    return `${minutes}:0${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}

module.exports = {
  getPlaylistSongs,
};
