const client = require("../connection/connection");

const userCollection = client.db("blood-buddies").collection("users");

exports.putUser = async (req, res) => {
  await client.connect();
  const { email } = req.body;
  const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      email,
    },
  };
  const result = await userCollection.updateOne(filter, updateDoc, options);
  var token = jwt.sign(email, process.env.SECRET_JWT_TOKEN);
  res.send({ success: true, result, token });
};

exports.getUser = async (req, res) => {
  await client.connect();
  const { email } = req.query;
  const user = await userCollection.findOne({ email: email });
  res.send(user);
};
