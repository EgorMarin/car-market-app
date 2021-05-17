const jwt = require('jsonwebtoken');
const { 
  SECRET_KEY, 
  AUTH_TOKEN_EXPIRATION_TIME, 
  REFRESH_TOKEN_EXPIRATION_TIME,
  RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
} = require('../config/constanst');

const createAndSaveAuthTokens = async (user, req) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRATION_TIME,
  });

  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

  user.refreshToken = refreshToken;
  user.lastLoginAt = Date.now();
  user.lastGeoIP =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress;
  await user.save();

  return { accessToken: `JWT ${token}`, refreshToken, user };
};

const createResetPasswordToken = async (user) => {
  const token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
  })

  user.resetPasswordToken = token
  user.save()

  return token
}

module.exports = {
  createAndSaveAuthTokens,
  createResetPasswordToken,
}