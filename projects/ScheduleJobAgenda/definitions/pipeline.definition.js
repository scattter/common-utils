const {PipelineScript} = require("../script/pipeline.script");
const { sendNotice } = require('../api/notice')

const pipelineDefinition = (agenda) => {
  agenda.define("log notice", async () => {
    const result = await PipelineScript.findOneData({a:1})
    console.log(result)
  });

  agenda.define("send notice", async () => {
    await sendNotice()
  })
}

module.exports = {
  pipelineDefinition
}