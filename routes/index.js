const router = require('express').Router()

const brands = require('./brands')
const ads = require('./ads')
const adsViews = require('./adsViews')
const models = require('./models')
const users = require('./users')
const auth = require('./auth')
const tags = require('./tags')
const adsTags = require('./adsTags')
const friendships = require('./friendships')

router.use('/auth', auth)
router.use('/users', users)
router.use('/brands', brands)
router.use('/models', models)
router.use('/ads', ads)
router.use('/ads-views', adsViews)
router.use('/tags', tags)
router.use('/ads-tags', adsTags)
router.use('/friendships', friendships)

module.exports = router