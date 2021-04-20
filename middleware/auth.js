const JWT = require("jsonwebtoken");
const mongodb = require("mongodb");
const { DBURL } = require("../keys");
const { JWT_SK } = require("../keys");
const cookieParser = require("cookie-parser");

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const DB_URL = DBURL || "mongodb://127.0.0.1:27017";

module.exports = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    // console.log(bearer, JWT_SK);
    if (!bearer) {
      return res.json({
        message: "You must Logged In",
      });
    }
    JWT.verify(bearer, JWT_SK, async (err, payload) => {
      if (!err) {
        const id = payload.id;

        const client = await mongoClient.connect(DB_URL);
        const db = client.db("loginInsta");
        const user = await db.collection("user").findOne({ _id: objectId(id) });
        req.user = user;
        // console.log(user);
        // users = user;
        next();
      } else {
        console.log(err);
        res.json({
          message: "You must Logged In",
        });
      }
    });
  } catch (error) {
    return res.json({
      message: "Authentication Failed",
    });
  }
};
