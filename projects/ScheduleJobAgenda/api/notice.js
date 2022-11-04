const { get, post } = require('./request');
const { NOTICE_URL } = require('../config/config.default')
const https = require("https");

const queryOpenedMR = (address, projectId, token) => {
  return get(`${address}/api/v4/projects/${projectId}/merge_requests?state=opened`, {
    headers: {
      'PRIVATE-TOKEN': token
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  }).then(res => {
    return res.data
  }).catch(err => {
    return Promise.reject(err)
  })
}

const DEFAULT_NOTICE = 'NOTICE'

const defaultContext = {
  sign: 'l4eh+ddddddddd=',
  timestamp: Math.round(new Date().getTime()/1000).toString(),
  msgType: 'text'
}

const sendNotice = (data = DEFAULT_NOTICE) => {
  const requestData = {
    ...defaultContext,
    msgData: {
      text:{
        content: data
      }
    }
  }
  return post(
    NOTICE_URL,
    {
      ...requestData
    }
  ).catch(err => {
    return Promise.reject(err)
  })
}


module.exports = {
  queryOpenedMR,
  sendNotice
}
