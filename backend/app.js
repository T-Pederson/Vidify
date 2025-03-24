const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const playlistRouter = require("./routes/playlistRouter");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRouter);
app.use("/playlists", playlistRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Vidify backend listening on port ${PORT}.`)
);
