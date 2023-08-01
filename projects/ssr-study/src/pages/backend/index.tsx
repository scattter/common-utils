import React, {memo} from 'react';
import {useSSR} from "../../../hooks/useSSR.ts";
import './index.css'

export interface IProps {

}

const Backend: React.FC<IProps> = () => {
  const { ssrData } = useSSR<{ url: string }>()
  return <div className="backend">this is backend page {ssrData?.url}</div>;
};

export default memo(Backend);
