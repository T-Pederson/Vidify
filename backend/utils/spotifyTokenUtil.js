require("dotenv").config();

async function getSpotifyToken(req) {
  if (req.app.locals.spotifyToken && !isTokenExpired(req)) {
    return req.app.locals.spotifyToken;
  }
  return await generateSpotifyToken(req);
}

async function generateSpotifyToken(req) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  });
  const json = await res.json();
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 59); // Giving a 1 min buffer for expiration time
  req.app.locals.spotifyTokenExpiration = expiration;
  req.app.locals.spotifyToken = json.access_token;
  return json.access_token;
}

function isTokenExpired(req) {
  if (Date.now() >= req.app.locals.spotifyTokenExpiration) {
    return true;
  }
  return false;
}

module.exports = { getSpotifyToken };
