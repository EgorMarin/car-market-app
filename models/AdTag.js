module.exports = (sequelize, DataTypes) => {
  const AdTag = sequelize.define("AdTag", {
    tagId: DataTypes.INTEGER,
    adsId: DataTypes.INTEGER
  })

  AdTag.associate = (models) => {
    AdTag.belongsTo(models.Tag, { foreignKey: 'tagId' })
    AdTag.belongsTo(models.Ad, { foreignKey: 'adsId' })
  }

  return AdTag
}