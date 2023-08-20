const ws = new require('ws')
const http = require('http')
const wss = new ws.Server({ noServer: true })

const clients = new Set()
http.createServer((req) => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect)
}).listen(8080)

function onConnect(ws) {
    clients.add(ws)
    console.log('new client connect')
    ws.on('message', (message, isBinary) => {
        // use isBinary to confirm message type
        const receiveData = isBinary ? message : message.toString()
        setTimeout(() => {
            for (let client of clients) {
                client.readyState === 1 &&  client.send(receiveData)
            }
        }, 1000)
    })
    ws.on('close', () => {
        clients.delete(ws)
    })
}