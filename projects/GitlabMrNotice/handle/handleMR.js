import {queryOpenedMR} from "../api/mr.js";
import {NoticeReview} from "../types";

export const handleMRData = () => {
  return queryOpenedMR().then(res => {
    if (res.length === 0) return 'empty'
    return res.map(result => {
        return new NoticeReview(result.title, 'cdp-web', result.author.name, result.assignee?.name, result.web_url, result.source_branch, result.target_branch, result.description)
      }
    )
    // const result = res[0]
    // return new NoticeReview(result.title, 'runner-test', result.author.name, result.assignee, result.web_url, result.source_branch, result.target_branch, result.description)
  }).catch(err => {
    console.log('error', err)
  })
}

