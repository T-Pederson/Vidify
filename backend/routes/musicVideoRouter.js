const { Router } = require("express");
const musicVideoController = require("../controllers/musicVideoController");
const musicVideoRouter = Router();

musicVideoRouter.get("/", musicVideoController.getMusicVideo);
musicVideoRouter.post("/alt-video-id", musicVideoController.alternateVideoId);

module.exports = musicVideoRouter;
