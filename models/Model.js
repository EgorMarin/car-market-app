module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("Model", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Brand, { foreignKey: 'brandId' })
    Model.hasMany(models.Vehicle, { foreignKey: "modelId" })
  }

  return Model
}