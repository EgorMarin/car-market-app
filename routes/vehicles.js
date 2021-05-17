const router = require('express').Router()
const { Vehicle, User } = require('../models')

router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: {
        model: User,
      }
    })

    res.json(vehicles)
  } catch (error) {
    console.log(error);
  }
})

router.post('/', async (req, res) => {
  const { userId, brand, model } = req.body

  try {
    const vehicle = await Vehicle.create({
      userId, brand, model
    })

    res.json(vehicle)
  } catch (error) {
    console.log(error);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Vehicle.destroy({ where: { id: req.params.id }})

    res.json('deleted')
  } catch (error) {
    console.log(error);
  }
})

module.exports = router