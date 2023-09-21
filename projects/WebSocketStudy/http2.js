// const express = require('express');
// const spdy = require('spdy');
// const fs = require('fs');
// const path = require('path');
// const app = express();
//
// app.get("/", async (req, res) => {
//   try {
//     res.end(fs.readFileSync(path.join(__dirname, './public/http2.html')))
//   }catch(error){
//     res.status(500).send(error.toString())
//   }
// })
//
// spdy.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, './public/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, './public/cert.pem'))
//   },
//   app
// ).listen(3000, (err) => {
//   if(err){
//     throw new Error(err)
//   }
//   console.log("Listening on port 3000")
// })

const http2 = require('node:http2');
const fs = require('node:fs');
const path = require("path");

const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(__dirname, './public/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './public/cert.pem')),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  if (headers[':path'] === '/about') {
    // 处理 /about 路由的逻辑
    stream.end('success');
  } else {
    stream.end(fs.readFileSync(path.join(__dirname, './public/http2.html')));
  }
});

server.listen(3000)