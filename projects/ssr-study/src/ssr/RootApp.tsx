import React, { memo } from 'react';
import {SSRProvider} from "./SSRProvider.tsx";
import {RootRouter} from "../common/RootRouter.tsx";

interface IRootAppProps {
  ssr: boolean;
  ssrData?: any;
  ssrPathname?: string;
  children: React.ReactNode | React.ReactNode[];
}
const RootApp: React.FC<IRootAppProps> = ({ ssr = false, ssrPathname = '', ssrData, children }) => {
  return <SSRProvider ssrData={ssrData}>
      <RootRouter ssr={ssr} ssrPathname={ssrPathname}>
        {children}
      </RootRouter>
    </SSRProvider>
};

export default memo(RootApp);
