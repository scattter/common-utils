//服务端渲染的入口
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.tsx";

export function render(url:string) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </StaticRouter>
  );
}