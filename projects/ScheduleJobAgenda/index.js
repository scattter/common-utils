const Agenda = require("agenda");
const { queryOpenedMR} = require("./request"); // [username:password@]
const mongoConnectionString = "mongodb://[username:password@]127.0.0.1:27017";
const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "notice" },
});

agenda.define("log notice", async (job) => {
  const { address, projectId, token } = job.attrs.data
  const data = await queryOpenedMR(address, projectId, token)
  console.log(data, '---')
});

(async function () {
  const dayReport = agenda.create("log notice", { address: 'xxx', projectId: 1, token: 'xxx' });
  // IIFE to give access to async/await
  await agenda.start();

  // Alternatively, you could also do:
  dayReport.repeatEvery("3 seconds");
  await dayReport.save();
})();
