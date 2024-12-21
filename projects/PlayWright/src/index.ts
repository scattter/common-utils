import express, { Express, Request, Response } from "express";
import fs from "fs";
import {FileParseAndDown} from "./filesParse";


const app: Express = express();
app.use(express.json()); // 用于解析 JSON 格式的请求体
const port = process.env.PORT || 3000;

let fileParse: undefined | FileParseAndDown;

app.get("/", (req: Request, res: Response) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync('./template/index.html'))
});

app.post("/login", async (req: Request, res: Response) => {
  fileParse = new FileParseAndDown(req.body.downloadUrl, req.body.phone, req.body.sharePwd)
  await fileParse.init()
  await fileParse.parseFiles()
  res.send({
    status: 200,
    message: 'start login'
  })
});

app.post("/code", (req: Request, res: Response) => {
  fileParse?.setCode(req.body.smsCode)
  res.send({
    status: 200
  })
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});