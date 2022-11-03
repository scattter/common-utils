const axios = require('axios');

const get = (url, params, config) => {
  return axios.get(url, {
    params,
    ...config,
  });
}

const post = (url, params, config) => {
  return axios.post(url, params, config);
}

module.exports = {
  get,
  post
}