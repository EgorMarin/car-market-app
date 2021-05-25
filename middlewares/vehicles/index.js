const Vehicle = require('../../models')

const checkIfOwner = async (req, res, next) => {
  const vehicleId = req.params.id
  const userId = req.user.id
  
  const isOwner = await Vehicle.findOne({
    where: { id: vehicleId, userId },
  })
  
  console.log('checkIfOwner', isOwner);

  if (!isOwner) {
    return res.status(401).json({ message: "You're not owner of vehicle!" })
  }

  next()
}


module.exports = {
  checkIfOwner
}