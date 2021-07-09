const router = require('express').Router();
const { Op } = require("sequelize");

const sequelize = require('../config/db')

const { Ad, AdTag, Tag } = require('../models');

// receive all ads by selected tags
router.get('/', async (req, res, next) => {
  const { tags } = req.body;

  try {
    // const ads = await Ad.findAll({
    //   include: {
    //     model: Tag,
    //     where: {
    //       [Op.or]: [
    //         ...tags
    //       ],
    //     },
    //   },
    // })
    // const filteredAds = ads.filter(ad => ad.Tags.length === tags.length)

    const ads = await sequelize.query(`
        SELECT 
          "Ad"."id" AS "adsId",
          COUNT("AdTags"."tagId") AS "tagsCount"
        FROM "Ads" AS "Ad" 
        INNER JOIN (
          "AdTags"
          INNER JOIN "Tags"
          ON "Tags"."id" = "AdTags"."tagId"
          )
        ON "Ad"."id" = "AdTags"."adsId" 
        WHERE ( "Tags"."name" = 'front-end' OR "Tags"."name" = 'back-end' )
        GROUP BY "Ad"."id"
        HAVING COUNT("AdTags"."tagId") = :tagsLength
      `,
      {
        replacements: {
          tagsLength: tags.length
        }
      }
    );

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