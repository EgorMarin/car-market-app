const router = require('express').Router()
const { Op } = require('sequelize')

const sequelize = require('../config/db')
const { Model, Ad } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const models = await Model.findAll()

    res.json(models)
  } catch (e) {
    next(e);
  }
})

router.get('/search', async (req, res, next) => {
  const { name } = req.query;

  try {
    // search names and sorting them
    // const models = await sequelize.query(`
    //   SELECT 
    //     "Models"."name" as "name",
    //     "Models"."id" as "id"
    //   FROM "Models"
    //   WHERE UPPER("Models"."name") LIKE UPPER('${name}%')
    //     OR UPPER("Models"."name") LIKE UPPER('%${name}%')
    //   ORDER BY 
    //     UPPER("Models"."name") LIKE UPPER('${name}%') DESC,
    //     "Models"."name" ASC
    // `)
    // or
    const models = await Model.findAll({
      where: {
        id: {
          [Op.in]: [
            sequelize.literal(`
              SELECT 
                "Models"."id" as "id"
              FROM "Models"
              WHERE UPPER("Models"."name") LIKE UPPER('${name}%')
                OR UPPER("Models"."name") LIKE UPPER('%${name}%')
              `,
            )
          ]
        }
      },
      order: [
        [sequelize.literal(`UPPER("Model"."name") LIKE UPPER('${name}%') DESC`)],
        ['name', 'ASC']
      ]
    })

    res.json(models)
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const model = await Model.findOne({
      where: { id },
      include: Ad,
    });

    res.json(model)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const { name, brandId } = req.body;

  try {
    const [model] = await Model.findOrCreate({ where: { name, brandId } });

    res.json(model)
  } catch (e) {
    next(e)
  }
})

module.exports = router;