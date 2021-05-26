const router = require('express').Router()

const { Brand, Model } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const brands = await Brand.findAll()

    res.json(brands)
  } catch (e) {
    next(e);
  }
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findOne({
      where: { id },
      include: {
        model: Model,
        as: 'models',
        required: true,
      },
    });

    res.json(brand)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const { name } = req.body;

  try {
    const [brand] = await Brand.findOrCreate({ where: { name } });

    res.json(brand)
  } catch (e) {
    next(e)
  }
})

module.exports = router;