const { agenda } = require('./db/agenda')
const MrListenModel = require('./model/mrListen.js')
const { allDefinitions } = require("./definitions/index");

(async function () {
  // 统一注册schedule
  allDefinitions(agenda);
  // 从sql主库里面查询配置的监测项目
  const mrListens = await MrListenModel.findAll()
  if (mrListens && Array.isArray(mrListens) && mrListens.length > 0) {
    for (const mrListen of mrListens) {
      // await agenda.every("3 seconds", "log notice")
      await agenda.every("5 seconds", "handle notice", mrListen.dataValues )
    }
  }
})();
