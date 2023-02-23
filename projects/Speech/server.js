const Koa = require('koa')
const fs = require("fs");
const bodyParser = require('koa-bodyparser')
const porcupine = require('./recognition.js')

const app = new Koa()

// 使用ctx.body解析中间件
app.use(bodyParser())

app.use(async (ctx, next) => {
  const path = ctx.path
  if (path === '/') {
    ctx.type = "html";
    ctx.body = fs.readFileSync("index.html");
  }

  if (path === '/res') {
    ctx.body = 'Hello World';
    console.log('===', ctx.request.body)
    const audioFrame = ctx.request.body.res;
    const keywordIndex = porcupine.process(audioFrame);
    if (keywordIndex === 0) {
      // detected `porcupine
    } else if (keywordIndex === 1) {
      // detected `bumblebee`
    }
  }
  next()
});

// app.use(function(req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'))
// })

app.listen(3000, function () {
  console.log('app is running...')
})