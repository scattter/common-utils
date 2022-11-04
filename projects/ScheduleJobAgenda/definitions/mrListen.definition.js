const MrListenService = require('../service/mrListen.service')

const mrListenDefinition = (agenda) => {
  agenda.define("handle notice", async (job) => {
    // address, projectId, token
    const { address, projectId, token } = job.attrs.data
    await MrListenService.handleMrListen({ address, projectId, token })
  })
}

module.exports = {
  mrListenDefinition
}