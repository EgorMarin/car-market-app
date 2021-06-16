module.exports = (sequelize, DataTypes) => {
  const AdsView = sequelize.define('AdsView', {})

  AdsView.associate = (models) => {
    AdsView.belongsTo(models.Ad, { foreignKey: 'adsId' })
  }

  return AdsView
}