'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  
  class FeedTags extends Model{}
  FeedTags.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    FeedId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'feedtags'
  });

  FeedTags.associate = function(models) {
    // associations can be defined here
    FeedTags.belongsTo(models.Feed);
    FeedTags.belongsTo(models.Tag);
  };
  return FeedTags;
};