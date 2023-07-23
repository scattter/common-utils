import fs from "fs";
import express from "express";
const app = express();

// 通过vite创建server服务
const { createServer: createViteServer } = await import("vite");
const isProduction = process.env.NODE_ENV === "production";
const ssrManifest = isProduction
  ? fs.readFileSync("./dist/client/ssr-manifest.json", "utf-8")
  : undefined;

//创建vite服务实例
let vite;
if (!isProduction) {
  // 开发环境下
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    base: "/",
  });
  // 使用 vite 中间件
  app.use(vite.middlewares);
} else {
  // 生产环境下，设置静态目录
  app.use(express.static("./dist/client"));
}

app.get("*", async (req, res) => {
  let template;
  let render;
  console.log('---', ssrManifest)

  // 如果是生产环境，直接读取打包后的index.html和server-entry.js
  // 开发环境实时编译
  if (isProduction) {
    template = fs.readFileSync("./dist/client/index.html", "utf-8");
    render = (await import("./dist/server/server-entry.js")).render
  } else {
    template = fs.readFileSync("index.html", "utf8");
    template = await vite.transformIndexHtml(req.url, template)
    render = (await vite.ssrLoadModule("/src/server-entry.tsx")).render
  }

  const html = await render(req.url);

  if (ssrManifest.url) {
    res.redirect(301, ssrManifest.url);
    return;
  }

  // 给index.html的id为root标签中添加 <!--APP_HTML-->，做为后边要替换的标志
  const responseHtml = template.replace("<!--APP_HTML-->", html);
  res.status(200).set({ "Content-Type": "text/html" }).end(responseHtml);
});
app.listen(5173, () => {});