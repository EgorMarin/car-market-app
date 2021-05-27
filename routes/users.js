const passport = require('passport');
const router = require('express').Router();

const { User, Ad } = require('../models');

router.get('/ads', passport.authenticate('jwt'), async (req, res) => {
  const userId = req.user.id

  try {
    const ads = await Ad.findAll({ where: { userId } })

    res.json(ads)
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