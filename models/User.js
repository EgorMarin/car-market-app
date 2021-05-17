module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: DataTypes.STRING,
    phone: DataTypes.STRING,
    refreshToken: {
      type: DataTypes.STRING,
      unique: true,
    },
    resetPasswordToken: DataTypes.STRING,
  })

  User.associate = (models) => {
    User.hasMany(models.Vehicle, { foreignKey: "userId" })
  }

  return User
}
