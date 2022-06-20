const client = require("../connection/connection");

const photoCollection = client.db("blood-buddies").collection("photos");

exports.insertImage = async (req, res) => {
  await client.connect();
  const photo = req.body;
  const images = await photoCollection.insertOne(photo);
  res.send(images);
};

exports.getImage = async (req, res) => {
  await client.connect();
  const images = await photoCollection.find({}).toArray();
  res.send(images);
};
