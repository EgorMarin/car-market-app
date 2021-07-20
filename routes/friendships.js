const router = require('express').Router()

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
    // const friends = await Friendship.findAll({
    //   where: { u1 }
    // })

    const friends = await User.findAll({
      where: { id },
      include: {
        model: User
      }
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