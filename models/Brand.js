module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("Brand", {
    name: DataTypes.String,
  })

  Brand.associate = (models) => {
    Brand.hasMany(models.Model, { foreignKey: "brandId" })
    Brand.hasMany(models.Vehicle, { foreignKey: "brandId" })
  }

  return Brand
}