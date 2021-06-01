const { Ad } = require('../../models')

const checkIfOwner = async (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id
  
  const isOwner = await Ad.findOne({
    where: { id, userId },
  })
  
  if (!isOwner) {
    return res.status(401).json({ message: "You're not owner of ad!" })
  }

  next()
}


module.exports = {
  checkIfOwner
}