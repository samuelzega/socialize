'use strict';
module.exports = (sequelize, DataTypes) => {
  const hashingPassword = require('../helpers/hashingPassord')
  const Model = sequelize.Sequelize.Model
  
  class User extends Model {}

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    secret: DataTypes.STRING,
    profilPict: DataTypes.STRING
  }, {
    hooks: {
        beforeCreate: (user, options) => {
            user.secret = String(Math.random() * 10000)
            user.password  = hashingPassword(user.secret, user.password)
        }
    }, 
    sequelize,
    tableName: 'users'
  });
  User.associate = function(models) {
    User.hasMany(models.Feed);
    User.belongsToMany(models.Feed, {through: models.LikeDislike})
  };
  return User;
};