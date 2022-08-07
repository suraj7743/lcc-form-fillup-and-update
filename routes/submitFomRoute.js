const express = require("express");
const submitRoute = express();
const multer = require("multer");
const submitDetailsController = require("../controllers/submitDetailsController");
const checkauth = require("../controllers/jwtmiddleware");
const bodyParser = require("body-parser");
submitRoute.use(bodyParser.json());
submitRoute.use(bodyParser.urlencoded({ extended: false }));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });
submitRoute.get("/", checkauth, submitDetailsController.submitMainPage);
submitRoute.post(
  "/",
  checkauth,
  upload.single("studentimage"),
  submitDetailsController.postSubmitDetails
);
module.exports = submitRoute;
