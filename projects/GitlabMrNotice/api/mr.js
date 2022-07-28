const axios = require('axios');
const https = require("https");

export const queryOpenedMR = () => {
  return axios.get('https://{your gitlab url}/api/v4/projects/90/merge_requests?state=opened', {
    headers: {
      'PRIVATE-TOKEN': '{your gitlab token}'
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
