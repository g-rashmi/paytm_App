const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const rootRouter = require("../backend/routes/index");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("https://paytm-app-2.onrender.com/api/v1", rootRouter);
app.listen(process.env.PORT, () => {
  console.log("server start");
});
