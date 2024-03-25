import http from 'http';
import fs from 'fs';
// import { createPoem } from './index.js'
import { pipeline } from "@xenova/transformers";

const server = http.createServer()
server.listen(3002, () => {
  console.log('server is listening on port 3002')
})

server.on('request', async (req, res) => {
  const html = fs.readFileSync('./index.html', 'utf-8')
  // createPoem().then(res => {
  //   console.log(res, '---')
  // })
  let reviewer = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');

  let result = await reviewer('The Shawshank Redemption is a true masterpiece of cinema.');
  console.log(result, '----')
  res.end(html)
})