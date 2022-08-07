const express = require("express");
const checkauth = require("../controllers/jwtmiddleware");
const studentController = require("../controllers/studentController");
const studentRoute = express();
studentRoute.get("/", checkauth, studentController.studentMainPage);
studentRoute.post("/", studentController.postStudentDetails);
studentRoute.get("/:id", checkauth, studentController.individualDetail);
module.exports = studentRoute;
///
