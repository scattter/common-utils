import index from "redis";

const client = index.createClient({
  url: 'redis://localhost:6379'
})

client.connect()

export default client