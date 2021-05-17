module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    brand: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
    }
  })

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.User, { foreignKey: 'userId' })
  }

  return Vehicle
}
