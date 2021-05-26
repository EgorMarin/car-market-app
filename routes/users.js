const passport = require('passport');
const router = require('express').Router();

const { User, Vehicle } = require('../models');

router.get('/vehicles', passport.authenticate('jwt'), async (req, res) => {
  const userId = req.user.id

  try {
    const vehicles = await Vehicle.findAll({ where: { userId } })

    res.json(vehicles)
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