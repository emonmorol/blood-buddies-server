const express = require("express");
const { getReview, postReview } = require("../controller/review.controller");

const verifyJWT = require("../middlewares/VerifyJWT");

const reviewRoute = express.Router();

reviewRoute.get("/", getReview);

reviewRoute.post("/", postReview);

module.exports = reviewRoute;
