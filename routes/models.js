const router = require('express').Router()

const { Brand, Model, Vehicle } = require('../models')

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const model = await Model.findOne({
      where: { id },
      include: Vehicle,
    });

    res.json(model)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res) => {
  const { name, brandId } = req.body;

  try {
    const model = await Model.create({ name, brandId });

    res.json(model)
  } catch (e) {
    next(e)
  }
})

module.exports = router;