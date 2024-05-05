const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const rootRouter = require("../backend/routes/index");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", rootRouter);
app.get("/", (req, res) => {
  return res.json({ msg: "server-start" });
});
app.listen(process.env.PORT, () => {
  console.log("server start");
});
