const express = require('express')
const {getAllInfo} = require("./info");

const app = express()

// app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile('./public/index.html', { root: __dirname });
})
app.get('/subscribe', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
     Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  });

  let counter = 0;

  // Send a message on connection
  res.write('event: connected\n');
  res.write(`data: You are now subscribed!\n`);
  res.write(`id: ${counter}\n\n`);
  counter += 1;

  // Send a subsequent message every five seconds
  setInterval(() => {
    const info = getAllInfo();
    res.write('event: message\n');
    res.write(`data: ${info.usage}\n`);
    res.write(`id: ${counter}\n\n`);
    counter += 1;
  }, 5000);

  // Close the connection when the client disconnects
  req.on('close', () => res.end('OK'))
});

app.listen(3000, () => {
    console.log('server start')
})