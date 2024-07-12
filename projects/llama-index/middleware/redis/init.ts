// import redis from 'redis'
const redis = require('redis')

const client = redis.createClient({
  url: 'redis://localhost:6379'
})

client.connect()

export default client
