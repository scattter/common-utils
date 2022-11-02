const axios = require('axios');
const https = require("https");

const queryOpenedMR = (address, projectId, token) => {
  return axios.get(`${address}/api/v4/projects/${projectId}/merge_requests?state=opened`, {
    headers: {
      'PRIVATE-TOKEN': token
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  }).then(res => {
    return res.data
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  queryOpenedMR
}
