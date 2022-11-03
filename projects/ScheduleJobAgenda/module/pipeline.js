const { DataTypes } = require('sequelize')

const mysql = require('../db/seq')

const PipelineModule = mysql.define(
  'pipeline',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pipelineName: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      unique: true,
      comment: '流水线名称, 唯一且不为空, 最长64个字符',
    },
    admin: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      unique: false,
      comment: '流水线创建人',
    },
    relateRepo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      defaultValue: 'normal',
      comment: '流水线绑定仓库',
    },
    relateBranch: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      defaultValue: 'master',
      comment: '流水线绑定分支',
    },
  },
  {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
  }
)

module.exports = PipelineModule
