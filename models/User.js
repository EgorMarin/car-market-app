const crypto = require("crypto-js");

const { SECRET_PASSWORD_KEY } = require("../config/constanst");

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
  }, {
    hooks: {
      beforeCreate(user) {
        user.password = crypto.AES.encrypt(user.password, `${SECRET_PASSWORD_KEY}`).toString()
      }
    }
  })

  User.associate = (models) => {
    User.hasMany(models.Ad, { foreignKey: "userId" })
    User.belongsToMany(models.User, { through: models.Friendship, as: 'user2', foreignKey: "u1" })
    User.belongsToMany(models.User, { through: models.Friendship, as: 'user1', foreignKey: "u2" })
  }

  return User
}
