const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const studentModel = require("./models/studentModel");
const studentRoute = require("./routes/studentRoute");
const formRoute = require("./routes/formRoute");
const loginRoute = require("./routes/loginroute");
const submitRoute = require("./routes/submitFomRoute");
const errorRoute = require("./routes/errorRoute");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
//handle the synchronous error of uncaughtException
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
const multer = require("multer");
app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(
  session({
    secret: "something",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.errors_msg = req.flash("errors_msg");
  next();
});
const dotenv = require("dotenv").config({ path: "./.env" });
app.use("/student", studentRoute);
app.use("/", formRoute);
app.use("/", loginRoute);
app.use("/", errorRoute);
app.use("/form", submitRoute);

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

app.post(
  "/student",
  upload.single("studentimage"),
  async function (req, res, next) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    const dataModel = new studentModel({
      studentName: req.body.studentName,
      imageemoji: req.body.imageemoji,
      studentFrom: req.body.studentFrom,
      studentCharacter: req.body.studentCharacter,
      studentHeight: req.body.studentHeight,
      studentRollno: req.body.studentRollno,
      studentGrade: req.body.studentGrade,
      studentDescription: req.body.studentDescription,
      studentimage: req.file.path,
      studentClass: req.body.studentClass,
    });
    const data = await dataModel.save();
    res.status(200).json({
      status: "success",
      data,
    });
    console.log(req.file, req.body);
  }
);

app.all("*", (req, res, next) => {
  const err = new Error("unhandled route");
  (err.status = "failure"), (err.statuscode = 404);
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.statuscode || 500).json({
    status: err.status || "error",
    message: err.message || "internal server error ",
  });
});
const mongodburl = process.env.MONGODBATLAS.replace(
  "DB_PASSWORD",
  process.env.DB_PASSWORD
);
const server = app.listen(process.env.PORT || 8000, async () => {
  await mongoose.connect(mongodburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
