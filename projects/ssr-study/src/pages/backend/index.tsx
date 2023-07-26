import React, {memo} from 'react';
import {useSSR} from "../../../hooks/useSSR.ts";

export interface IProps {

}

const Backend: React.FC<IProps> = () => {
  const { ssrData } = useSSR<{ url: string }>()
  return <div>this is backend page {ssrData?.url}</div>;
};

export default memo(Backend);
