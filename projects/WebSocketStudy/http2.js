const express = require('express');
const spdy = require('spdy');
const fs = require('fs');
const path = require('path');
const {promisify} = require("util");

const readFile = promisify(fs.readFile)
const app = express();
app.use('/', express.static('public', {
  index: 'http2.html'
}))

// app.get('/', (req, res) => {
//   res.writeHead(200);
//   res.end(fs.readFileSync('./http2.html'))
// })

app.get("/", async (req, res) => {
  try {
    const stream = res.push("/test.js", {
      status: 200,
      method: 'GET', // optional
      request: {
        accept: '*/*'
      },
      response: {
        'content-type': 'application/javascript',
      }
    })

    stream.on('error', function () { })
    stream.end(fs.readFileSync(path.join(__dirname, './public/test.js')))
    res.end(fs.readFileSync(path.join(__dirname, './public/http2.html')))
  }catch(error){
    res.status(500).send(error.toString())
  }
})

spdy.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, './public/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './public/cert.pem'))
  },
  app
).listen(3000, (err) => {
  if(err){
    throw new Error(err)
  }
  console.log("Listening on port 3000")
})