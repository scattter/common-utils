const Agenda = require("agenda");
const { client } = require("./mongo");

// 直接使用mongodb的连接  不用监听是否成功连接
const agenda = new Agenda({
  mongo: client.db('test')
});

(async function () {
  await agenda.start();
})()

module.exports = {
  agenda
}