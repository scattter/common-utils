const { MongoClient } = require('mongodb');

const { MONGO_DB_URL } = require('../config/config.default')

// Connection
const client = new MongoClient(MONGO_DB_URL);

(async () => {
  await client.connect()
})()

module.exports = {
  client
}