'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let arrQuery =[
      queryInterface.addColumn('users', 'first_name', Sequelize.STRING ),
      queryInterface.addColumn('users', 'last_name', Sequelize.STRING ),
      queryInterface.addColumn('users', 'email', Sequelize.STRING ),
      queryInterface.addColumn('users', 'secret', Sequelize.STRING )
  ]
      return Promise.all(arrQuery)
  },

  down: (queryInterface, Sequelize) => {
    let arrQuery =[
      queryInterface.removeColumn('users', 'first_name' ),
      queryInterface.removeColumn('users', 'last_name' ),
      queryInterface.removeColumn('users', 'email' ),
      queryInterface.removeColumn('users', 'secret' )
  ]
      return Promise.all(arrQuery)
  }
};
