const router = require('express').Router()
const crypto = require("crypto-js");

const { User } = require('../models')
const { createAndSaveAuthTokens, createResetPasswordToken } = require('../helpers/tokens')
const validate = require('../helpers/validationSchemaHelper')
const { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema
} = require('../validations/auth');
const { SECRET_PASSWORD_KEY } = require('../config/constanst');
const sendMail = require('../helpers/sendMail')
const getBaseUrl = require('../helpers/domain')

router.post('/register', validate(registerSchema), async (req, res) => {
  const { email, fullName, password, phone } = req.body
  
  try {
    const encryptedPassword = crypto.AES.encrypt(password, `${SECRET_PASSWORD_KEY}`).toString()

    const user = await User.create({ email, fullName, phone, password: encryptedPassword })
    const tokens = await createAndSaveAuthTokens(user, req)

    res.json(tokens)
  } catch (e) {
    next(e);
  }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } });

    const decryptedPassword = crypto
    .AES
    .decrypt(user.password, SECRET_PASSWORD_KEY)
    .toString(crypto.enc.Utf8);

    if (decryptedPassword !== password) {
      return res.status(400).json({
        key: 'error.validation-password',
        message: 'Invalid password!',
      });
    }

    const tokens = await createAndSaveAuthTokens(req.user, req)
    res.json(tokens)
  } catch (e) {
    next(e);
  }
});

router.post('/refresh-token', validate(refreshTokenSchema), async (req, res) => {
  try {
    const tokens = await createAndSaveAuthTokens(req.user, req)
    res.json(tokens)
  } catch (e) {
    next(e)
  }
});

router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const resetToken = await createResetPasswordToken(req.user)

    sendMail({
      to: req.user.email,
      subject: 'Car Market Reset Password',
      html: `<a href="${getBaseUrl(req)}/reset-password?token=${resetToken}">Reset Password</a>`
    })

    res.json('sent')
  } catch (error) {
    next(e)
  }
})

router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { user, body: { password }} = req

    user.resetPasswordToken = null
    user.password = password
    user.save()

    res.json('reset')
  } catch (error) {
    next(e)
  }
})

module.exports = router