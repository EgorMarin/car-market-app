module.exports = (sequelize, DataTypes) => {
  const AdTag = sequelize.define("AdTag", {
    tagId: DataTypes.INTEGER,
    adsId: DataTypes.INTEGER
  })

  return AdTag
}