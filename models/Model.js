module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("Model", {
    name: DataTypes.String,
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Brand, { foreignKey: 'brandId' })
    Model.hasMany(models.Vehicle, { foreignKey: "modelId" })
  }

  return Model
}