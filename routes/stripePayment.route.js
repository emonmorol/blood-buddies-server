const express = require("express");
const { stripePayment } = require("../controller/stripePayment.controller");

const verifyJWT = require("../middlewares/VerifyJWT");

const stripePaymentRoute = express.Router();

stripePaymentRoute.post("/", stripePayment);

module.exports = stripePaymentRoute;
