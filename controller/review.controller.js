const client = require("../connection/connection");

const reviewCollection = client.db("blood-buddies").collection("review");

exports.postReview = async (req, res) => {
  await client.connect();
  const { email } = req.body;
  const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      email,
    },
  };
  const result = await reviewCollection.updateOne(filter, updateDoc, options);
  var token = jwt.sign(email, process.env.SECRET_JWT_TOKEN);
  res.send({ success: true, result, token });
};

exports.getReview = async (req, res) => {
  await client.connect();
  const reviews = await reviewCollection.find({}).toArray();
  res.send(reviews);
};
