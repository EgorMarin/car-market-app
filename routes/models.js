const router = require('express').Router()

const { Model, Ad } = require('../models')

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const model = await Model.findOne({
      where: { id },
      include: Ad,
    });

    res.json(model)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const { name, brandId } = req.body;

  try {
    const [model] = await Model.findOrCreate({ where: { name, brandId } });

    res.json(model)
  } catch (e) {
    next(e)
  }
})

module.exports = router;