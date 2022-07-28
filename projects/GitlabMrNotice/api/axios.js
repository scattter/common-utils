// import { createRequire } from 'module'
// 解决ES和cjs引入的问题
// const require = createRequire(import.meta.url)
const axios = require('axios');

export const get = (url, params, config) => {
  return axios.get(url, {
    params,
    ...config,
  });
}

export const post = (url, params, config) => {
  return axios.post(url, params, config);
}
