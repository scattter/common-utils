const ws = new require('ws')
const fs = require('fs')
const http = require('http')
const wss = new ws.Server({ noServer: true })

const clients = new Set()
const server = http.createServer((req, res) => {
  if (req.url === '/ws') {
    res.end(fs.readFileSync('./index.html'))
  } else {
    res.end('hello')
  }
})

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, onConnect);
});

server.listen(8080)
function onConnect(ws, req) {
  clients.add(ws)
  ws.on('message', (message, isBinary) => {
    // use isBinary to confirm message type
    const receiveData = isBinary ? message : message.toString()
    // 广播给所有非自身的客户端
    if (receiveData !== 'ping') {
      for (let client of clients) {
        ws !== client && client.send(`${req.socket.remotePort}: ${receiveData}`)
      }
    }
    setTimeout(() => {
      if (receiveData !== 'ping') {
        for (let client of clients) {
          client.readyState === 1 && client.send('pang')
        }
      }
    }, 1000)
  })
  ws.on('close', () => {
    clients.delete(ws)
  })
}