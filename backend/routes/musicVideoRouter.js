const { Router } = require("express");
const musicVideoController = require("../controllers/musicVideoController");
const musicVideoRouter = Router();

musicVideoRouter.get("/", musicVideoController.getMusicVideo);

module.exports = musicVideoRouter;
