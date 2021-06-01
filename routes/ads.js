const passport = require('passport');
const router = require('express').Router();
const { pick } = require('lodash')

const { Ad, User, Model, Brand } = require('../models')
const { checkIfOwner } = require('../middlewares/ads')
const validate = require('../helpers/validationSchemaHelper')
const { createAd } = require('../validations/ads');
const { imageUploader }  = require('../config/multer')

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'owner'
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

router.patch('/:id', [passport.authenticate('jwt'), checkIfOwner], async (req, res, next) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findOne({ where: { id } })

    const fields = pick(req.body, ['year', 'name'])

    Object.keys(fields).forEach(key => {
      return ad[key] = fields[key]
    })

    await ad.save()

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

router.post('/photos', imageUploader.single('image') , async (req, res, next) => {
  console.log(req.file);
  const api = 'http://localhost:3001'
  try {

    res.json(`${api}/images/${req.file.filename}`)
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