const express = require("express");
const { putUser, getUser } = require("../controller/user.controller");
const verifyJWT = require("../middlewares/VerifyJWT");

const userRoute = express.Router();

userRoute.put("/", putUser);

userRoute.get("/", verifyJWT, getUser);

module.exports = userRoute;
