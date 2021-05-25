const router = require('express').Router()
const { User } = require('../models')

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    res.json(user)
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