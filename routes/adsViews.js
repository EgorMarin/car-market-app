const router = require('express').Router()

const { Ad, AdsView, Model, Brand } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const adsViews = await AdsView.findAll()

    res.json(adsViews)
  } catch (e) {
    next(e);
  }
})

router.get('/:adsId', async (req, res, next) => {
  const { adsId } = req.params;

  try {
    const adsViews = await AdsView.findAll({
      where: { adsId },
      include: {
        model: Ad,
        attributes: ['id'],
        include: {
          model: Model,
          attributes: ['id'],
          include: {
            model: Brand,
            attributes: ['name']
          }
        }
      },
    })

    res.json(adsViews)
  } catch (e) {
    next(e);
  }
})

module.exports = router