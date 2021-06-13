const getExt = (originalname) => originalname.substr(
  originalname.lastIndexOf('.') + 1
)

module.exports = { getExt }