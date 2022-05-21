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

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    // console.log(process.env.SECRET_JWT_TOKEN);
    // console.log(token);
    jwt.verify(
      authHeader,
      process.env.SECRET_JWT_TOKEN,
      function (err, decoded) {
        if (err) {
          console.log(err);
          res.status(403).send({ message: "Forbidden Access" });
        } else {
          req.decoded = decoded;
          next();
        }
      }
    );
  }
  if (!authHeader) {
    res.status(401).send({ message: "Unauthorized Access" });
  }
}

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("blood-buddies").collection("users");
    const appointmentCollection = client
      .db("blood-buddies")
      .collection("appointments");
    const photoCollection = client.db("blood-buddies").collection("photos");

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

    app.get("/user", verifyJWT, async (req, res) => {
      const { email } = req.query;
      const user = await userCollection.findOne({ email: email });
      res.send(user);
    });

    app.post("/appointments", verifyJWT, async (req, res) => {
      const { email, date } = req.query;
      console.log(email, date);
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

    app.get("/appointments", verifyJWT, async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const appoints = await appointmentCollection.find(query).toArray();
      res.send(appoints);
    });

    app.get("/appointments/:id", verifyJWT, async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const appoints = await appointmentCollection.findOne(query);
      res.send(appoints);
    });

    app.delete("/appointments/:id", verifyJWT, async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const appoints = await appointmentCollection.deleteOne(query);
      res.send(appoints);
    });

    app.put("/appointments/:id", verifyJWT, async (req, res) => {
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

    app.post("/create-payment-intent", verifyJWT, async (req, res) => {
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

    app.get("/photo", async (req, res) => {
      const images = await photoCollection.find({}).toArray();
      res.send(images);
    });

    app.post("/photo", async (req, res) => {
      const photo = req.body;
      const images = await photoCollection.insertOne(photo);
      res.send(images);
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
