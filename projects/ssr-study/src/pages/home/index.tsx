import React, { memo } from 'react';

export interface IProps {

}

const Home: React.FC<IProps> = () => {
  return <div>this is home page</div>;
};

export default memo(Home);
