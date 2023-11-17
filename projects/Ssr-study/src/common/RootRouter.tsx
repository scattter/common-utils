import React from "react";
import {StaticRouter} from "react-router-dom/server";
import {BrowserRouter} from "react-router-dom";

interface IRootRouterProps {
  ssr: boolean;
  ssrPathname: string;
  children: React.ReactNode | React.ReactNode[];
}

/**
 * 默认全部走浏览器BrowserRoute方式
 */
export const RootRouter: React.FC<IRootRouterProps> = ({ ssr, ssrPathname, children }) => {
  if (ssr) {
    return <StaticRouter location={ssrPathname}>{children}</StaticRouter>;
  }

  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}