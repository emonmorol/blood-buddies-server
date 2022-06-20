const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const galleryRoute = require("./routes/gallary.route");
const client = require("./connection/connection");
const userRoute = require("./routes/user.route");
const verifyJWT = require("./middlewares/VerifyJWT");
const appointmentRoute = require("./routes/appointment.route");

const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//middle wares
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.json());

app.use("/photo", galleryRoute);
app.use("/user", userRoute);
app.use("/appointments", appointmentRoute);

async function run() {
  try {
    await client.connect();

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
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Port Running ${port}`);
});
