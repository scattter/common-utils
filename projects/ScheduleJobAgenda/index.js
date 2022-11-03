const { agenda } = require('./db/agenda')
const Pipeline = require('./module/pipeline.js')
const { PipelineScript } = require("./script/pipeline.script");

agenda.define("log notice", async () => {
  const result = await PipelineScript.findOneData({a:1})
  console.log(result)
});

(async function () {
  await agenda.start();
  // 从sql主库里面查询配置的监测项目
  const pipelines = await Pipeline.findAll()
  if (pipelines && Array.isArray(pipelines) && pipelines.length > 0) {
    for (const pipeline of pipelines) {
      const dayReport = agenda.create("log notice", {});
      // IIFE to give access to async/await
      // Alternatively, you could also do:
      dayReport.repeatEvery("3 seconds");
      await dayReport.save();
    }
  }
})();
