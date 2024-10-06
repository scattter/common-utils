import client from "./index.js";

/**
 * Set a value in Redis with an optional expiration time.
 * @param {string} key The key under which to store the value.
 * @param {string} value The value to store.
 * @param {number} [expire] Optional expiration time in seconds.
 */
const setStringValue = async (key, value, expire) => {
  if (expire) {
    await client.set(key, value, 'EX', expire);
  } else {
    await client.set(key, value);
  }
}

const setHashMapValue = async (key, value) => {
  const transformed = {}
  Object.keys(value).forEach(key => {
    transformed[key] = JSON.stringify(value[key])
  })
  await client.hSet(key, transformed);
}

/**
 * Get a value from Redis.
 * @param {string} key The key of the value to retrieve.
 * @returns {Promise<string|null>} The value, if found, otherwise null.
 */
const getStringValue = async (key) => {
  return  await client.get(key);
}

const getHashMapValue = async (key) => {
  const data =  await client.hGetAll(key);
  const transformed = {}
  Object.keys(data).forEach(key => {
    transformed[key] = JSON.parse(data[key])
  })
  return transformed
}

/**
 * Delete a key from Redis.
 * @param {string} key The key to delete.
 */
const deleteKey = async (key) => {
  await client.del(key);
};

export { setStringValue, setHashMapValue, getStringValue, getHashMapValue, deleteKey };