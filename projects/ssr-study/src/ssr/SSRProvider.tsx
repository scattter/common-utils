import React, {createContext, useMemo} from "react";

export const SSRContext = createContext<{ ssrData?: any }>({
  ssrData: undefined,
});
SSRContext.displayName = 'SSRContext';

interface ISSRProviderProps {
  ssrData?: any
  children: React.ReactNode | React.ReactNode[]
}
export const SSRProvider: React.FC<ISSRProviderProps> = ({ ssrData, children }) => {
  const value = useMemo(() => {
    // 兼容服务端渲染
    let tempData;
    if (typeof window !== "undefined") {
      tempData = (window as any)?.ssrData ?? ssrData;
    } else {
      tempData = ssrData;
    }
    return {
      ssrData: tempData,
    };
  }, [ssrData]);

  return <SSRContext.Provider value={value}>{children}</SSRContext.Provider>;
}