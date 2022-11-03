const { client } = require('../db/mongo')
const db = client.db('test')
const DEFAULT_COLLECTION = 'notice-1'

class PipelineScript {
  constructor() {}

  // 插入单条数据
  async insertOneData(data, collection = DEFAULT_COLLECTION) {
    await db.collection(collection).insertOne({ data })
  }

  // 查询单条数据
  async findOneData(data, collection = DEFAULT_COLLECTION) {
    return await db.collection(collection).find(data).toArray()
  }
}

module.exports = {
  PipelineScript: new PipelineScript()
}