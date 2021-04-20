const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const router = express.Router();
const { DBURL } = require("../keys");
const auth = require("../middleware/auth");

router.use(express.json());
router.use(cors());

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const DB_URL = DBURL || "mongodb://127.0.0.1:27017";

router.get("/allpost", auth, async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("loginInsta");
    const user = await db.collection("userpost").find().toArray();
    // console.log(user);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    client.close();
  }
});

router.post("/createpost", auth, async (req, res) => {
  try {
    const post = {
      title: req.body.title,
      description: req.body.description,
      photo: req.body.photo,
      key: req.user._id,
      by: req.user,
    };
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("loginInsta");
    const user1 = await db.collection("userpost").insertOne(post);

    // console.log(user.ops);
    res.json({ message: "ok", post: user1.ops });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    client.close();
  }
});

router.get("/mypost", auth, async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("loginInsta");
    const user = await db
      .collection("userpost")
      .find({ key: objectId(req.user._id) })
      .toArray();
    // res.json({ user: users });

    // console.log(user.ops);
    res.json({ message: "ok", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    client.close();
  }
});

module.exports = router;
