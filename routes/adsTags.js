const router = require('express').Router();
const { Op, literal } = require("sequelize");

const sequelize = require('../config/db')

const { Ad, AdTag, Tag } = require('../models');

router.get('/', async (req, res, next) => {
  const { tags } = req.body;

  try {
    // receive all ads by selected tags*
    // const ads = await Ad.findAll({
    //   where: {
    //     id: {
    //       [Op.in]: [
    //         sequelize.literal(`
    //           SELECT "AdTags"."adsId"
    //           FROM "AdTags"
    //           WHERE "AdTags"."tagId" IN (${tags})
    //           GROUP BY "AdTags"."adsId"
    //           HAVING COUNT("AdTags"."tagId") = ${tags.length}
    //         `)
    //       ]
    //     }
    //   },
    //   include: {
    //     model: Tag,
    //     through: {
    //       attributes: []
    //     }
    //   }
    // })
    // *another way
    // const ads = await sequelize.query(`
    //     SELECT 
    //       "Ads"."id" AS "adsId"
    //     FROM "Ads"
    //     INNER JOIN (
    //       "AdTags"
    //       INNER JOIN "Tags"
    //       ON "Tags"."id" = "AdTags"."tagId"
    //       )
    //     ON "Ads"."id" = "AdTags"."adsId" 
    //     WHERE "Tags"."id" IN (:tags)
    //     GROUP BY "Ads"."id"
    //     HAVING COUNT("AdTags"."tagId") = :tagsLength
    //   `,
    //   {
    //     replacements: {
    //       tags,
    //       tagsLength: tags.length
    //     }
    //   }
    // );

    // receive posts with similarly its tags which were provided from post
    // const ads = await Ad.findAll({
    //   where: { 
    //     id: {
    //       [Op.and]: [
    //         { [Op.ne]: req.body.adsId },
    //         { [Op.in]: [
    //           sequelize.literal(`
    //             SELECT "AdTags"."adsId" as "adsId"
    //             FROM "AdTags"
    //             LEFT JOIN "Tags"
    //             ON "Tags"."id" = "AdTags"."tagId"
    //             WHERE "Tags"."id" IN (
    //               SELECT
    //                 "AdTags"."tagId" as "tagId"
    //               FROM "AdTags"
    //               LEFT JOIN "Ads"
    //               ON "Ads"."id" = "AdTags"."adsId"
    //               WHERE "Ads"."id" = ${req.body.adsId}
    //             )
    //           `)
    //         ] }
    //       ]
    //     },
    //   },
    //   include: [
    //     {
    //       model: Tag,
    //       through: {
    //         attributes: []
    //       }
    //     },
    //   ]
    // })

    res.json(ads)
  } catch (e) {
    next(e)
  }
})

// receive ad with its tags
router.get('/:id/tags', async (req, res, next) => {
  const adsId = req.params.id

  try {
    const ad = await Ad.findAll({
      include: {
        model: Tag,
        required: true,
        through: {
          where: { adsId },
          attributes: []
        }
      }
    })

    res.json(ad)
  } catch (e) {
    next(e)
  }
})

// adding tag to ad
router.post('/tag', async (req, res, next) => {
  const { tagId, adsId } = req.body;

  try {
    const adTag = await AdTag.create({ tagId, adsId })

    res.json(adTag)
  } catch (e) {
    next(e)
  }
})

module.exports = router