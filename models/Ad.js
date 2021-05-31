module.exports = (sequelize, DataTypes) => {
  const Ad = sequelize.define('Ad', {
    vehicleType: {
      type: DataTypes.ENUM('AUTO', 'MOTO', 'TRUCK', 'BUS', 'AIR', 'WATER'),
      defaultValue: 'AUTO',
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: DataTypes.STRING,
    vin: {
      type: DataTypes.STRING,
      validate: {
        min: 17,
        max: 17,
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
    Ad.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' })
    Ad.belongsTo(models.Model, { foreignKey: 'modelId' })
  }

  return Ad
}
