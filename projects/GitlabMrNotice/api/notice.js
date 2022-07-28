import {post} from "./axios.js";

const DEFAULT_NOTICE = 'please send correct response'

const defaultContext = {
  sign: 'l4eh+ddddddddd=',
  timestamp: Math.round(new Date().getTime()/1000).toString(),
  msgType: 'text'
}

export const sendNotice = (data = DEFAULT_NOTICE) => {
  const requestData = {
    ...defaultContext,
    msgData: {
      text:{
        content: data
      }
    }
  }
  return post(
    'https://{your im url with token}',
    {
      ...requestData
    }
  )
}
