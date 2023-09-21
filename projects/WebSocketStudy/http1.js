const express = require('express');
const fs = require("node:fs");
const path = require("path");
const app = express();

app.get('/', (req, res) => {
  res.end(fs.readFileSync(path.join(__dirname, './public/http2.html')))
})
app.get('/about', (req, res) => {
  res.end('success')
})

app.listen(4000, () => {
  console.log('success')
})