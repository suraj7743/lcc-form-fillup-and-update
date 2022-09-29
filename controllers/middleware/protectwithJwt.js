const jwt = require("jsonwebtoken");
const catchAsync = require("../../utils/Catchasync");
const appError = require("../../utils/AppError");
const { promisify } = require("util");
const FormModel = require("../../models/FormModel");

const protectMiddleware = async (req, res, next) => {
  //1 first check whether the req. headers and req.headers.authoreization exist or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .send(
        "<h3> Sorry You arenot authorized to this page First <a href='/login'>/login</a> to continue </h3> "
      );
  }

  //2)) verify the token with secret key
  const decoded = await promisify(jwt.verify(token, process.env.JWT_KEY));
  //3Check whether user exist or not after token verified
  const freshUser = await FormModel.findOne({ _id: decoded.id });
  if (!freshUser) {
    return res
      .status(401)
      .send(
        '<h3> Cannot find the user with the provided token Go back to <a href="/login">login</a> and try again</h3> '
      );
  }
  //4)) check if password changed or not after token issued
  const validDate = Date.parse(freshUser.passwordChangedDate) / 1000;
  if (decoded.iat < validDate) {
    return res
      .status(401)
      .send(
        "You just changed your password.Please <a href='/login'>login</a> and proceed "
      );
  }
  req.user = freshUser;
  res.cookie("jwt", freshUser, {
    expires: new Date(Date.now() + 30 * 24 * 3600000),
  });
  next();
};
module.exports = protectMiddleware;
