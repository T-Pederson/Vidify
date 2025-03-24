const { Router } = require("express");
const playlistController = require("../controllers/playlistController");
const playlistRouter = Router();

playlistRouter.get("/:playlistId", playlistController.getPlaylistSongs);

module.exports = playlistRouter;
