const router = require('express').Router()

const { Brand, Model } = require('../models')

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.findAll()

    res.json(brands)
  } catch (e) {
    next(e);
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findOne({
      where: { id },
      include: Model,
    });

    res.json(brand)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const brands = await Brand.create({ name });

    res.json(brands)
  } catch (e) {
    next(e)
  }
})

module.exports = router;