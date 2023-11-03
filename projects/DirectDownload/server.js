const express = require('express')

const fs = require('fs')
const { handleDownload } = require('./UrlDownload')
const {queryFolderInfo} = require("./QueryFolderInfo");

const app = express()
app.use(express.static('public'))
let sseResponse = null

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync('index.html'))
})

app.post('/download', (req, res) => {
  req.on('data', (chunk) => {
    const { url, filePath } = JSON.parse(chunk)
    const cb = (progressEvent) => {
      const { total, rate, progress } = progressEvent
      if (total && sseResponse) {
        if (progress !== 1) {
          const text = `总大小: ${(total/1024/1024).toFixed()}M 下载进度: ${(progress * 100).toFixed(2)}% 下载速度: ${(rate/1024/1024).toFixed(2)}Mb/s`
          sseResponse.write(`data: ${text}\n\n`);
        } else {
          sseResponse.write(`data: 下载完成\n\n`);
        }
      }
    }
    handleDownload(url, filePath, cb).then(() => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok')
    }).catch(err => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err)
    })
  })
})

app.get('/subscribe', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  });

  // Send a message on connection
  res.write('event: connected\n');
  res.write(`data: You are now subscribed!\n\n`);

  sseResponse = res

  // Close the connection when the client disconnects
  req.on('close', () => res.end('OK'))
})

app.post('/folderInfo', (req, res) => {
  req.on('data', async (chunk) => {
    const { path } = JSON.parse(chunk)
    const filesInfo = await queryFolderInfo(path);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: filesInfo
    }))
  })
})

app.get('*', (req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404')
})

app.listen(9000, () => {
  console.log('listening on *:9000');
})