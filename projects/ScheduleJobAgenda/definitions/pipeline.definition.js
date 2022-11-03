const PipelineService = require('../service/pipeline.service')

const pipelineDefinition = (agenda) => {
  agenda.define("handle notice", async (job) => {
    // address, projectId, token
    const { relateRepo: address, projectId, token } = job.attrs.data
    await PipelineService.handlePipeline({ address, projectId, token })
  })
}

module.exports = {
  pipelineDefinition
}