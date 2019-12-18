'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('feeds', [{
      userId: 1,
      title: "post user 1",
      content: "seed post pertama user 1",
      createdAt: new Date('2019-12-18T14:05:00.444Z'),
      updatedAt: new Date('2019-12-18T14:05:00.444Z')
    },{
      userId: 2,
      title: "post user 2",
      content: "seed post pertama user 2",
      createdAt: new Date('2019-12-19T14:05:00.444Z'),
      updatedAt: new Date('2019-12-19T14:05:00.444Z')
    },{
      userId: 1,
      title: "post user 1",
      content: "seed post kedua user 1",
      createdAt: new Date('2019-12-17T14:05:00.444Z'),
      updatedAt: new Date('2019-12-17T14:05:00.444Z')
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('feeds', null, {});
  }
};
