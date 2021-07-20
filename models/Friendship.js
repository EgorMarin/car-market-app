module.exports = (sequelize, DataTypes) => {
  const Friendship = sequelize.define("Friendship", {
    u1: DataTypes.INTEGER,
    u2: DataTypes.INTEGER
  })

  Friendship.associate = (models) => {
    Friendship.belongsTo(models.User, { as: 'user1', foreignKey: 'u1' })
    Friendship.belongsTo(models.User, { as: 'user2', foreignKey: 'u2' })
  }

  return Friendship
}