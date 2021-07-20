const router = require('express').Router()
const { Op, literal } = require('sequelize')

const { User, Friendship } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const friendships = await Friendship.findAll()

    res.json(friendships)
  } catch (e) {
    next(e);
  }
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // find your friens which have common friends with you
    // const friends = await Friendship.findAll({
    //   attributes: ['"user1"."id"'],
    //   where: {
    //     u1: {
    //       [Op.ne]: id
    //     },
    //     u2: [
    //       literal(`
    //         SELECT F."u2"
    //         FROM "Friendships" AS F
    //         WHERE F."u1" = :id
    //       `)
    //     ],
    //   },
    //   include: [
    //     { model: User, as: 'user1' }
    //   ],
    //   replacements: { id },
    //   group: ['"user1"."id"']
    // })

    const friends = await User.findAll({
      include: {
        model: User,
        as: 'user2',
        attributes: [],
        required: true,
        through: {
          where: {
            u1: {
              [Op.ne]: id
            },
            u2: [
              literal(`
                SELECT F."u2"
                FROM "Friendships" AS F
                WHERE F."u1" = :id
              `)
            ]
          }
        }
      },
      replacements: { id }
    })

    res.json(friends)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const { u1, u2 } = req.body;

  try {
    if (u1 === u2) {
      return res.status(403).send("You can't add yourself as friend!")
    }

    const friendship = await Friendship.create({
      u1, u2
    })

    res.json(friendship)
  } catch (e) {
    next(e);
  }
})

module.exports = router