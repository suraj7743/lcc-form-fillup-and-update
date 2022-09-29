const express = require("express");
const checkauth = require("../controllers/jwtmiddleware");
const studentController = require("../controllers/studentController");
const jwtProtectMiddleware = require("../controllers/middleware/protectwithJwt");
const studentRoute = express();
studentRoute.get("/", jwtProtectMiddleware, studentController.studentMainPage);
studentRoute.post("/", studentController.postStudentDetails);
studentRoute.get("/:id", checkauth, studentController.individualDetail);
module.exports = studentRoute;
///
