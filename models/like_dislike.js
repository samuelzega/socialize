'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model

  class LikeDislike extends Model{}
  
  LikeDislike.init({
    FeedId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize
  });
  LikeDislike.associate = function(models) {
    // associations can be defined here
    LikeDislike.belongsTo(models.Feed);
    LikeDislike.belongsTo(models.User);
  };
  return LikeDislike;
};