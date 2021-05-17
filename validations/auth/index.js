const registerSchema = require('./registerSchema')
const loginSchema = require('./loginSchema')
const refreshTokenSchema = require('./refreshTokenSchema')
const forgotPasswordSchema = require('./forgotPasswordSchema')
const resetPasswordSchema = require('./resetPasswordSchema')

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
}