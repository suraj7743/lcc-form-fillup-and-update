const express = require("express");
const loginroute = express();

const loginController = require("../controllers/loginController");
loginroute.get("/login", loginController.loginpage);
loginroute.post("/login", loginController.postLogin);
module.exports = loginroute;
