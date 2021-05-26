const router = require('express').Router()

const brands = require('./brands')
const vehicles = require('./vehicles')
const models = require('./models')
const users = require('./users')
const auth = require('./auth')

router.use('/auth', auth)
router.use('/users', users)
router.use('/brands', brands)
router.use('/models', models)
router.use('/vehicles', vehicles)

module.exports = router