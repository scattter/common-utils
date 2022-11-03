const Agenda = require("agenda");
const { MONGO_DB_URL } = require('../config/config.default')

const agenda = new Agenda({
  db: { address: MONGO_DB_URL, collection: "notice" },
});

module.exports = {
  agenda
}