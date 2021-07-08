module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("Tag", {
    name: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
  })

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Ad, { through: 'AdTags', foreignKey: "tagId" })
  }

  return Tag
}