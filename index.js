const express = require("express");
const { DBURL } = require("./keys");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const DB_URL = DBURL || "mongodb://127.0.0.1:27017";

const PORT = process.env.PORT || 8000;

app.use(require("./routes/auth"));
app.use(require("./routes/post"));

app.listen(PORT, () => {
  console.log(`App is running in ${PORT}`);
});
