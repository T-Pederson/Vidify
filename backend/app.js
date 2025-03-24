const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Vidify backend listening on port ${PORT}.`)
);
