const passport = require('passport');
const router = require('express').Router();

const { Vehicle, User, Model, Brand } = require('../models')
const { checkIfOwner } = require('../middlewares/vehicles')
const validate = require('../helpers/validationSchemaHelper')
const { createVehicle } = require('../validations/vehicles')

router.get('/:id', async (req, res, next) => {
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

router.post('/', [passport.authenticate('jwt'), validate(createVehicle)], async (req, res, next) => {
  const { modelId, type, price, age } = req.body
  const userId = req.user.id

  try {
    const vehicle = await Vehicle.create({ userId, modelId, type, price, age })

    res.json(vehicle)
  } catch (e) {
    next(e);
  }
})

router.patch('/', [passport.authenticate('jwt'), checkIfOwner], async (req, res, next) => {
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

router.delete('/:id', [passport.authenticate('jwt'), checkIfOwner], async (req, res, next) => {
  const { id } = req.params;
  
  try {
    await Vehicle.destroy({ where: { id }})

    res.json('deleted')
  } catch (e) {
    next(e);
  }
})

module.exports = router