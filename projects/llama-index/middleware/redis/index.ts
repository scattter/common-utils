import client from "@/middleware/redis/init";

/**
 * Set a value in Redis with an optional expiration time.
 * @param {string} key The key under which to store the value.
 * @param {string} value The value to store.
 * @param {number} [expire] Optional expiration time in seconds.
 */
const setValue = async (key: string, value: string, expire?: number) => {
  if (expire) {
    await client.set(key, value, 'EX', expire);
  } else {
    await client.set(key, value);
  }
};

/**
 * Get a value from Redis.
 * @param {string} key The key of the value to retrieve.
 * @returns {Promise<string|null>} The value, if found, otherwise null.
 */
const getValue = async (key: string): Promise<string | null> => {
  const value = await client.get(key);
  return value;
};

/**
 * Delete a key from Redis.
 * @param {string} key The key to delete.
 */
const deleteKey = async (key: string) => {
  await client.del(key);
};

export { setValue, getValue, deleteKey };