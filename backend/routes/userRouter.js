const { Router } = require("express");
const userController = require("../controllers/userController");
const userRouter = Router();

userRouter.get("/:username", userController.getUserPlaylists);

module.exports = userRouter;
