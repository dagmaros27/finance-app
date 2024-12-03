const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const transactionRoute = require("./routes/transactionRoutes");
const { db_init } = require("./utils/db");
const { errorHandler, notFound } = require("./middlewares/error");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

db_init();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("starter application");
});

app.use("/api/user/", userRoute);
app.use("/api/transaction/", transactionRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
