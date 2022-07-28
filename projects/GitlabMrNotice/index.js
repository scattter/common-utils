import { createRequire } from 'module'
import {responseType} from "./types";
import {response} from "./types/response";
import {handleMRData} from "./handle/handleMR.js";
import {sendNotice} from "./api/notice.js";

// 解决ES和cjs引入的问题
const require = createRequire(import.meta.url)
const schedule = require('node-schedule');



const notice = (data) => {
    return sendNotice(data).then(
      res => {
        console.log(res.data);
        console.log(new Date(), '发送成功')
      }
    ).catch(error => {
      console.error(error)
    });
}

const mrStash = {}


// const hourList = [10, 11, 12, 14, 15, 16, 17]
schedule.scheduleJob('5 * * * * *', function(){
  handleMRData().then(messages => {
    console.log(mrStash, messages.length, '-------')
    if (messages.length !== 0) {
      messages.forEach(message => {
        if (mrStash[message.link]) return
        mrStash[message.link] = 1
        const noticeReviewInfo = response(message, responseType.REVIEW)
        notice(noticeReviewInfo).then(() => {})
      })
    }
  });
});
