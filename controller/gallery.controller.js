const client = require("../connection/connection");

const photoCollection = client.db("blood-buddies").collection("photos");

exports.insertImage = async (req, res) => {
  const photo = req.body;
  const images = await photoCollection.insertOne(photo);
  res.send(images);
};

exports.getImage = async (req, res) => {
  const images = await photoCollection.find({}).toArray();
  res.send(images);
};
