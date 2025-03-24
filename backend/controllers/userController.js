const { getSpotifyToken } = require("../utils/spotifyTokenUtil");

async function getUserPlaylists(req, res, next) {
  try {
    const spotifyToken = `Bearer ${await getSpotifyToken(req)}`;
    const username = req.params.username;
    const playlistsData = { playlists: [] };

    const response = await fetch(
      `https://api.spotify.com/v1/users/${username}/playlists`,
      {
        headers: {
          Authorization: spotifyToken,
        },
      }
    );
    const json = await response.json();

    for (const item of json.items) {
      playlistsData.playlists.push({
        id: item.id,
        image: item.images?.[0]?.url || "",
        name: item.name,
      });
    }

    res.json(playlistsData);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getUserPlaylists,
};
