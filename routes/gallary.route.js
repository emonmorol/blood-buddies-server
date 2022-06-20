const express = require("express");
const { insertImage, getImage } = require("../controller/gallery.controller");

const galleryRoute = express.Router();

galleryRoute.get("/", getImage);

galleryRoute.post("/", insertImage);

module.exports = galleryRoute;
