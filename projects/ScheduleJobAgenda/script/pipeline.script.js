const { client } = require('../db/mongo')
const db = client.db('test')
const DEFAULT_COLLECTION = 'notice-1'

class PipelineScript {
  constructor() {}

  // 插入单条数据
  async insertOneData(data, collection = DEFAULT_COLLECTION) {
    try {
      await db.collection(collection).insertOne({ data })
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  // 查询单条数据
  async findOneData(filter, collection = DEFAULT_COLLECTION) {
    return db.collection(collection).find({ data: filter }).toArray();
  }
}

module.exports = new PipelineScript()