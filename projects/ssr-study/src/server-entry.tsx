//服务端渲染的入口
import ReactDOMServer from "react-dom/server";
import RootApp from "./ssr/RootApp.tsx";
import App from "./App.tsx";

export function render(url:string) {
  const ssrData = {
    data: {
      url: undefined as string | undefined,
    }
  }
  ssrData.data.url = url === '/home' ? undefined : `ssr render`
  const html = ReactDOMServer.renderToString(
    <RootApp ssr ssrData={ssrData.data} ssrPathname={url}>
      <App />
    </RootApp>
  )
  return {
    html,
    data: ssrData.data
  };
}