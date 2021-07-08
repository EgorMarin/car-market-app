const router = require('express').Router();

const { User, AdTag, Ad, Tag } = require('../models');

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll()

    res.json(tags)
  } catch (e) {
    next(e);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const adTags = await Ad.findAll({
      include: [
        { 
          model: Tag, 
          required: true, 
          through: {
            attributes: []
          } 
        },
      ],
    })

    res.json(adTags)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const { name } = req.body;

  try {
    const tag = await Tag.create({ name })

    res.json(tag)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Tag.destroy({ where: { id: req.params.id } })

    res.json('deleted')
  } catch (e) {
    next(e);
  }
})

module.exports = router