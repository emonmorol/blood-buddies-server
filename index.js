const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@bloodbuddies.a5wux.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("blood-buddies").collection("users");
    const appointmentCollection = client
      .db("blood-buddies")
      .collection("appointments");

    app.put("/user", async (req, res) => {
      const { email } = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          email,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send({ success: true, result });
    });

    app.get("/user", async (req, res) => {
      const { email } = req.query;
      const user = await userCollection.findOne({ email: email });
      res.send(user);
    });

    app.post("/appointments", async (req, res) => {
      const { email, date } = req.query;

      const query = { email: email, date: date };

      const appoints = await appointmentCollection.findOne(query);
      // if (appoints[0]) {

      // }
      if (appoints) {
        res.send({ success: false });
      } else {
        const appointment = req.body;
        const result = await appointmentCollection.insertOne(appointment);
        res.send({ success: true });
      }
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Port Running ${port}`);
});
