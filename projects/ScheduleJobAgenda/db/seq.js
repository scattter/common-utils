const { Sequelize } = require('sequelize')

const {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PWD,
  MYSQL_USER,
} = require('../config/config.default')

const mysql = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
})

module.exports = mysql
