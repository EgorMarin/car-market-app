const router = require('express').Router();

const { User, Ad, Model, Brand } = require('../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()

    res.json(users)
  } catch (e) {
    next(e);
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const users = await User.findOne({
      where: { id },
      include: {
        model: Ad,
        include: {
          model: Model,
          include: Brand,
        }
      }
    })

    res.json(users)
  } catch (e) {
    next(e);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } })

    res.json('deleted')
  } catch (e) {
    next(e);
  }
})

module.exports = router