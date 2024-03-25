const express = require('express');
const fs = require("node:fs");
const path = require("path");
const app = express();

const FAKE_DB_MAP = {
  '/short': '/long-link'
}

app.get('/', (req, res) => {
  res.end(fs.readFileSync(path.join(__dirname, './origin.html')))
})

app.get('/short', (req, res) => {
  res.writeHead(302, {
    Location: FAKE_DB_MAP['/short'],
  });
  res.end();
})

app.get('/long-link', (req, res) => {
  res.end(fs.readFileSync(path.join(__dirname, './long.html')))
})

app.listen(4000, () => {
  console.log('success')
})