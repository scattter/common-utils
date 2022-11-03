const { agenda } = require('./db/agenda')
const PipelineModule = require('./module/pipeline.js')
const { allDefinitions } = require("./definitions/index");

(async function () {
  // 统一注册schedule
  allDefinitions(agenda);
  // 从sql主库里面查询配置的监测项目
  const pipelines = await PipelineModule.findAll()
  if (pipelines && Array.isArray(pipelines) && pipelines.length > 0) {
    for (const pipeline of pipelines) {
      await agenda.every("3 seconds", "log notice")
      await agenda.every("5 seconds", "send notice")
    }
  }
})();
