const passport = require('passport');
const router = require('express').Router();

const { Ad, User, Model, Brand } = require('../models')
const { checkIfOwner } = require('../middlewares/ads')
const validate = require('../helpers/validationSchemaHelper')
const { createAd } = require('../validations/ads')

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findOne({
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

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

router.post('/', [passport.authenticate('jwt'), validate(createAd)], async (req, res, next) => {
  const { modelId, vehicleType, price, year, vin, description } = req.body
  const userId = req.user.id

  try {
    const ad = await Ad.create({ 
      userId, modelId, vehicleType, price, year, vin, description 
    })

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

router.patch('/', [passport.authenticate('jwt'), checkIfOwner], async (req, res, next) => {
  const { modelId, name } = req.body
  const userId = req.user.id

  try {
    const ad = await Ad.findOne({ userId, modelId })

    // ad.name = name
    // await ad.save()

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

router.delete('/:id', [passport.authenticate('jwt'), checkIfOwner], async (req, res, next) => {
  const { id } = req.params;
  
  try {
    await Ad.destroy({ where: { id }})

    res.json('deleted')
  } catch (e) {
    next(e);
  }
})

module.exports = router