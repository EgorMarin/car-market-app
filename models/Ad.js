const { VEHICLE_TYPE } = require("../config/constanst")

module.exports = (sequelize, DataTypes) => {
  const Ad = sequelize.define('Ad', {
    vehicleType: {
      type: DataTypes.ENUM(
        VEHICLE_TYPE.AUTO, 
        VEHICLE_TYPE.MOTO, 
        VEHICLE_TYPE.BUS, 
        VEHICLE_TYPE.TRUCK, 
        VEHICLE_TYPE.WATER, 
        VEHICLE_TYPE.AIR
      ),
      defaultValue: VEHICLE_TYPE.AUTO,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: DataTypes.STRING,
    vin: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [17],
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        min: 20,
        max: 2000,
      }
    },
  })

  Ad.associate = (models) => {
    Ad.hasMany(models.AdsView, { foreignKey: 'adsId' })
    Ad.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' })
    Ad.belongsTo(models.Model, { foreignKey: 'modelId' })
    Ad.belongsToMany(models.Tag, { through: models.AdTag, foreignKey: 'adsId' })
  }

  return Ad
}
