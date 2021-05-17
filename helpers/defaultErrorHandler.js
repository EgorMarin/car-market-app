const Sequelize = require('sequelize');
const ApiError = require('./apiError');

module.exports = (err, req, res, next) => {
  if (!err) {
    next();
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      key: err.key,
      message: err.message,
    });
  }

  if (err instanceof Sequelize.ValidationError) {
    return res.status(err.status || 400).json(
      err.errors.map(({ path, validatorKey, validatorArgs, message }) => ({
        path,
        validatorKey: `error.${validatorKey}`,
        validatorArgs,
        message,
      }))
    );
  }

  return res.status(err.status || 500).json({ message: err.message });
};
