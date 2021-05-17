module.exports = class ApiError extends Error {
  constructor({ message, key, status = 400 }) {
    super(message);
    this.name = this.constructor.name;
    this.key = key;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
};
