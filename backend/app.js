require("dotenv").config();

const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const playlistRouter = require("./routes/playlistRouter");
const musicVideoRouter = require("./routes/musicVideoRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRouter);
app.use("/playlists", playlistRouter);
app.use("/music-video", musicVideoRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Vidify backend listening on port ${PORT}.`)
);
