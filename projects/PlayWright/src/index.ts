import express, { Express, Request, Response } from "express";
import fs from "fs";
import {FakeLogin} from "./FakeLogin";


const app: Express = express();
app.use(express.json()); // 用于解析 JSON 格式的请求体
const port = process.env.PORT || 3000;

let fakeLogin: undefined | FakeLogin;

app.get("/", (req: Request, res: Response) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync('./template/index.html'))
});

app.post("/login", (req: Request, res: Response) => {
  fakeLogin = new FakeLogin(req.body.phone)
  fakeLogin.login()
  res.send({
    status: 200,
    message: 'start login'
  })
});

app.post("/code", (req: Request, res: Response) => {
  fakeLogin?.setCode(req.body.code)
  res.send({
    status: 200
  })
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});