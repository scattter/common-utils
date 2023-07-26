import React, { memo } from 'react';
import {useSSR} from "../../../hooks/useSSR.ts";

export interface IProps {

}

const Home: React.FC<IProps> = () => {
  const { ssrData } = useSSR<{ url: string }>()
  return <div>this is home page{ ssrData?.url }</div>;
};

export default memo(Home);
