const { DataTypes } = require('sequelize')

const mysql = require('../db/seq')

const MrListenModel = mysql.define(
  'merge_request_listen',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      unique: true,
      comment: '此监听的名称',
    },
    owner: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      unique: false,
      comment: '创建监听的创建人',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: '监听地址(gitlab的url地址)',
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      comment: '监听项目id',
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      defaultValue: 'master',
      comment: '监听分支',
    },
  },
  {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
  }
)

module.exports = MrListenModel
