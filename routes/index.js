const router = require('express').Router()
const vehicles = require('./vehicles')
const users = require('./users')
const auth = require('./auth')

router.use('/auth', auth)
router.use('/users', users)
router.use('/vehicles', vehicles)

module.exports = router