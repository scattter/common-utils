import {useContext} from "react";
import {SSRContext} from "../src/ssr/SSRProvider";

export const useSSR = <T extends any = any>() => {
  const { ssrData } = useContext(SSRContext)
  return { ssrData: ssrData as T | undefined}
}