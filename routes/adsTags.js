const router = require('express').Router();
const { Op, literal } = require("sequelize");

const sequelize = require('../config/db')

const { Ad, AdTag, Tag } = require('../models');

router.get('/', async (req, res, next) => {
  const { tags } = req.body;

  try {
    // receive all ads by selected tags
    // переделать
    // const ads = await Ad.findAll({
    //   include: {
    //     model: Tag,
    //     attributes: {
    //       include: [
    //         [
    //           sequelize.literal(
    //             `COUNT("Tags"."id")`
    //           ),
    //           'tagsCount',
    //         ],
    //       ],
    //     },
    //     where: {
    //       [Op.or]: [
    //         ...tags
    //       ],
    //     },
    //   },
    //   group: ['"Ad"."id"'],
    //   having: sequelize.literal(`COUNT('"Tags->AdTags"."tagId"') = ${tags.length}`),
    // })

    // receive all ads by selected tags
    // const ads = await sequelize.query(`
    //     SELECT 
    //       "Ad"."id" AS "adsId",
    //       COUNT("AdTags"."tagId") AS "tagsCount"
    //     FROM "Ads" AS "Ad" 
    //     INNER JOIN (
    //       "AdTags"
    //       INNER JOIN "Tags"
    //       ON "Tags"."id" = "AdTags"."tagId"
    //       )
    //     ON "Ad"."id" = "AdTags"."adsId" 
    //     WHERE ( "Tags"."id" = 1 OR "Tags"."id" = 2 )
    //     GROUP BY "Ad"."id"
    //     HAVING COUNT("AdTags"."tagId") = :tagsLength
    //   `,
    //   {
    //     replacements: {
    //       tagsLength: tags.length
    //     }
    //   }
    // );

    // receive posts with similarly its tags which from provided post
    const ads = await Ad.findAll({
      where: { 
        id: {
          [Op.ne]: req.body.adsId
        },
      },
      include: [
        {
          model: Tag,
          // where: {
          //   id: {
          //     [Op.in]: [
          //     sequelize.literal(` 
          //       SELECT
          //         "Tags"."id" as "tagId"
          //       FROM "Ads" AS "Ad" 
          //       INNER JOIN (
          //         "AdTags"
          //         INNER JOIN "Tags"
          //         ON "Tags"."id" = "AdTags"."tagId"
          //         )
          //       ON "Ad"."id" = "AdTags"."adsId"
          //       WHERE "Ad"."id" = ${req.body.adsId}
          //     `)
          //     ]
          //   }
          // },
          through: {
            required: true,
            where: {
              tagId: {
                [Op.in]: [
                  sequelize.literal(` 
                    SELECT
                      "Tags"."id" as "tagId"
                    FROM "Ads" AS "Ad" 
                    INNER JOIN (
                      "AdTags"
                      INNER JOIN "Tags"
                      ON "Tags"."id" = "AdTags"."tagId"
                      )
                    ON "Ad"."id" = "AdTags"."adsId"
                    WHERE "Ad"."id" = ${req.body.adsId}
                  `)
                ],
              }
            }, 
            attributes: []
          }
        },
        {
          model: Tag,
          required: false
        }
      ]
    })

    // const ads = await AdTag.findAll({
    //   attributes: [
    //     sequelize.literal(
    //       `(
    //         SELECT
    //           DISTINCT("AdTags"."adsId")
    //         FROM "AdTags"
    //       )`
    //     ),
    //     '"AdTags"."adsId"'
    //   ],
    //   where: { 
    //     tagId: {
    //       [Op.in]: [
    //         sequelize.literal(` 
    //           SELECT
    //             "Tags"."id" as "tagId"
    //           FROM "Ads" AS "Ad" 
    //           INNER JOIN (
    //             "AdTags"
    //             INNER JOIN "Tags"
    //             ON "Tags"."id" = "AdTags"."tagId"
    //             )
    //           ON "Ad"."id" = "AdTags"."adsId"
    //           WHERE "Ad"."id" = ${req.body.adsId}
    //         `)
    //       ],
    //     },
    //     adsId: {
    //       [Op.ne]: req.body.adsId
    //     }
    //   },
    //   include: [
    //     {
    //       model: Ad,
    //       include: {
    //         model: Tag,
    //       }
    //     }
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