import React, { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../pages/home";
import Backend from "../pages/backend";

interface IRouterProps {}

const SPARouter: React.FC<IRouterProps> = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/backend" element={<Backend />} />
      <Route path="*" element={<span>未匹配视图</span>} />
    </Routes>
  );
};

export default memo(SPARouter);
