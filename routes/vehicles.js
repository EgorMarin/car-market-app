const passport = require('passport');
const router = require('express').Router();

const { Vehicle, User, Model, Brand } = require('../models')
const { checkIfOwner } = require('../middlewares/vehicles')

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'owner',
        },
        {
          model: Model,
          include: Brand
        },
      ]
    })

    res.json(vehicle)
  } catch (e) {
    next(e);
  }
})

router.post('/', passport.authenticate('jwt'), async (req, res) => {
  const { modelId } = req.body
  const userId = req.user.id

  console.log('req.user', userId, 5565446);

  try {
    const vehicle = await Vehicle.create({ userId, modelId })

    res.json(vehicle)
  } catch (e) {
    next(e);
  }
})

router.patch('/', [passport.authenticate('jwt'), checkIfOwner], async (req, res) => {
  const { modelId, name } = req.body
  const userId = req.user.id

  try {
    const vehicle = await Vehicle.findOne({ userId, modelId })

    // vehicle.name = name
    // await vehicle.save()

    res.json(vehicle)
  } catch (e) {
    next(e);
  }
})

router.delete('/:id', [passport.authenticate('jwt'), checkIfOwner], async (req, res) => {
  const { id } = req.params;
  
  try {
    await Vehicle.destroy({ where: { id }})

    res.json('deleted')
  } catch (e) {
    next(e);
  }
})

module.exports = router