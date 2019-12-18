'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  
  class Tag extends Model {}

  Tag.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'tags'
  });
  Tag.associate = function(models) {
    // associations can be defined here
    Tag.belongsToMany(models.Feed, {through: models.FeedTags});
  };
  return Tag;
};