const express = require("express");
const mongodb = require("mongodb");
const { DBURL } = require("../keys");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { JWT_SK } = require("../keys");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const router = express.Router();
router.use(express.json());
router.use(cors());
router.use(cookieParser());

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const DB_URL = DBURL || "mongodb://127.0.0.1:27017";

// router.get("/protected", auth, (req, res) => {
//   res.send("Protected1");
// });

router.get("/", (req, res) => {
  res.send("route");
});

router.post("/signup", async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("loginInsta");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const data = {
      name: req.body.name,
      mail: req.body.mail,
      pic: req.body.image,
      password: hash,
    };
    var mailValid = await db
      .collection("user")
      .findOne({ mail: req.body.mail });
    if (mailValid) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      await db.collection("user").insertOne(data);
    }
    res.status(200).json({ message: "Registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    client.close();
  }
});

router.post("/login", async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("loginInsta");
    const user = await db.collection("user").findOne({ mail: req.body.mail });
    if (user) {
      var cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        console.log("user" + user);
        var userToken = JWT.sign({ id: objectId(user._id) }, JWT_SK);
        res
          .header("authorization", userToken)

          .json({ message: "allow", userToken, user });
      } else {
        res.status(400).json({ message: "Password Incorrect" });
      }
    } else {
      res.status(400).json({
        message: "Email not found",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    // client.close();
  }
});

module.exports = router;
