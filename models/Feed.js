'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  
  class Feed extends Model{}
  Feed.init({
    UserId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'feeds'
  });
  Feed.associate = function(models) {
    // associations can be defined here
    Feed.belongsTo(models.User)
    Feed.belongsToMany(models.Tag, {through: models.FeedTags});
    Feed.belongsToMany(models.User, {through: models.LikeDislike})
  };
  return Feed; 
};