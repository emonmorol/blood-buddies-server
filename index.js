const express = require("express");
const cors = require("cors");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
      var token = jwt.sign(email, process.env.SECRET_JWT_TOKEN);
      res.send({ success: true, result, token });
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
      if (appoints) {
        res.send({ success: false });
      } else {
        const appointment = req.body;
        const result = await appointmentCollection.insertOne(appointment);
        res.send({ success: true });
      }
    });

    app.get("/appointments", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const appoints = await appointmentCollection.find(query).toArray();
      res.send(appoints);
    });

    app.get("/appointments/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const appoints = await appointmentCollection.findOne(query);
      res.send(appoints);
    });

    app.delete("/appointments/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const appoints = await appointmentCollection.deleteOne(query);
      res.send(appoints);
    });

    app.put("/appointments/:id", async (req, res) => {
      const { id } = req.params;
      const { appointmentId, transactionId } = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          appointmentId,
          transactionId,
        },
      };

      const result = await appointmentCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = price * 100;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
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
