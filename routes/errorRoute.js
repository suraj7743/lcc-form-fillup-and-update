const express = require("express");
const errorController = require("../controllers/errorController");
const errorRoute = express();
errorRoute.get("/error", errorController);
module.exports = errorRoute;
