class appError extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
    this.statu = `${statuscode}`.startsWith(4) ? "error" : "failure";
    this.isOperatoinal = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = appError;
