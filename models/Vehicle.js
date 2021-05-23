module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    type: DataTypes.ENUM('AUTO', 'MOTO', 'TRUCK', 'BUS', 'AIR', 'WATER'),
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    age: DataTypes.INTEGER,
  })

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.User, { foreignKey: 'userId' })
    Vehicle.belongsTo(models.Brand, { foreignKey: 'brandId' })
    Vehicle.belongsTo(models.Model, { foreignKey: 'modelId' })
  }

  return Vehicle
}
