const express = require("express");
const cors = require("cors");
require("dotenv").config();

const galleryRoute = require("./routes/gallary.route");
const userRoute = require("./routes/user.route");
const appointmentRoute = require("./routes/appointment.route");
const stripePaymentRoute = require("./routes/stripePayment.route");

const app = express();

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
app.use("/create-payment-intent", stripePaymentRoute);

/* not found routes */
app.use((req, res, next) => {
  res.status(404).send({ success: false, message: "Not Found Route" });
});
/* Server Error Routes */
app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ success: false, message: "Something Broke of your API" });
});

module.exports = app;
