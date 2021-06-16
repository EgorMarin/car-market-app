const router = require('express').Router()

const brands = require('./brands')
const ads = require('./ads')
const adsViews = require('./adsViews')
const models = require('./models')
const users = require('./users')
const auth = require('./auth')

router.use('/auth', auth)
router.use('/users', users)
router.use('/brands', brands)
router.use('/models', models)
router.use('/ads', ads)
router.use('/adsViews', adsViews)

module.exports = router