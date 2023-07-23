import React, { memo } from 'react';

export interface IProps {

}

const Backend: React.FC<IProps> = () => {
  return <div>this is backend page</div>;
};

export default memo(Backend);
