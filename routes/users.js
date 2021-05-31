const router = require('express').Router();

const { User } = require('../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()

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