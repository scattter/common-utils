const PipelineScript = require("../script/pipeline.script");
const { convertToBaseInfo } = require('../type/pipeline.type')
const { queryOpenedMR, sendNotice } = require('../api/notice')

class PipelineService {
  // 判断是否保存mr信息到数据库以及发送信息
  async handlePipeline({address, projectId, token}) {
    try {
      // 当前所有未合入的mr信息
      const pipelines = await queryOpenedMR(address, projectId, token)

      if (pipelines && pipelines.length > 0) {
        for (let pipeline of pipelines) {
          const collection = `notice-${projectId}`
          const noticeInfo = convertToBaseInfo(pipeline)

          if (noticeInfo) {
            const oldData = await PipelineScript.findOneData(noticeInfo, collection)

            // 如果当前新的mr不存在数据库中, 保存起来, 同时发送信息到指定位置
            if (Array.isArray(oldData) && oldData.length === 0) {
              await PipelineScript.insertOneData(noticeInfo, collection).then(() => {
                this.sendPipelineNotice(noticeInfo).then(() => {
                  console.log('success send notice')
                })
              }).catch(e => {
                return new Error(e)
              })
            } else {
              console.log('当前 mr 已经处理过')
            }
          } else {
            return new Error('error response data can not translate')
          }
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  // 发送信息
  async sendPipelineNotice(data) {
    sendNotice(data).catch(e => {
      throw new Error(e)
    })
  }
}

module.exports = new PipelineService()