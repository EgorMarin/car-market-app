const router = require('express').Router()
const { Op } = require('sequelize')
const moment = require('moment')
// const sequelize = require('../config/db')
const sequelize = require('sequelize')

const { Ad, AdsView, Model, Brand } = require('../models')

router.get('/', async (req, res, next) => {
  const { startDate, endDate } = req.body;

  try {
    // get count of views of brands
    // const result = await sequelize.query(`
    //   SELECT
    //     COUNT(AV.id)::int as views,
    //     B.name as brand
    //   FROM "AdsViews" AV
    //   INNER JOIN "Ads" A on AV."adsId" = A.id
    //   INNER JOIN "Models" M on M.id = A."modelId"
    //   INNER JOIN "Brands" B on M."brandId" = B.id
    //   WHERE AV."createdAt" BETWEEN :startDate AND :endDate
    //   GROUP BY B.name
    //   ORDER BY views ${sortOrder}
    //   `,
    //   {
    //     replacements: {
    //       startDate: moment(startDate).format(),
    //       endDate: moment(endDate).format()
    //     },
    //     mapToModel: true,
    //     model: Brand,
    //   }
    // );

    // get count of views of brands (v2)
    // const result = await AdsView.findAll({
    //   attributes: [
    //     // [sequelize.literal('(SELECT count(AV.id) as views FROM "AdsViews" AV)'), 'views']
    //     [sequelize.fn('COUNT', sequelize.col('"AdsView"."id"')), 'views'],
    //     [sequelize.literal('"Ad->Model->Brand"."id"'), 'brand']
    //   ],
    //   include: {
    //     model: Ad,
    //     attributes: [],
    //     include: {
    //       model: Model,
    //       attributes: [],
    //       include: {
    //         model: Brand,
    //         attributes: ['name']
    //       }
    //     },
    //   },
    //   group: ['"Ad->Model->Brand"."id"'],
    // })

    // get first added ad
    // const result = await Brand.findAll({
    //   include: {
    //     model: Model,
    //     as: 'models',
    //     order: [['createdAt', 'ASC']],
    //     limit: 1,
    //     required: false,
    //     include: {
    //       model: Ad,
    //       order: [['createdAt', 'ASC']],
    //       limit: 1,
    //       required: false,
    //     }
    //   }
    // })

    res.json(result)
  } catch (e) {
    next(e);
  }
})

router.get('/:adsId', async (req, res, next) => {
  const { adsId } = req.params;
  const { startDate, endDate } = req.body;

  const where = {
    adsId,
    ...((startDate && endDate) && { 
      'createdAt': {[Op.between] : [moment(startDate), moment(endDate) ]}
    }),
  }

  try {

    const adsViews = await AdsView.findAll({
      where,
      include: {
        model: Ad,
        attributes: ['id'],
        include: {
          model: Model,
          attributes: ['id'],
          include: {
            model: Brand,
            attributes: ['name']
          }
        }
      },
    })

    res.json(adsViews)
  } catch (e) {
    next(e);
  }
})

module.exports = router