import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import RegisterFace from './page/RegisterFace';
import FacialRecTest from './page/FacialRecTest';
import DefaultLayout from './Layouts/defaultLayout';
import ViewLogs from './page/ViewLogs';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<div>Hello from router</div>} />
          <Route path="/register" element={<RegisterFace />} />
          <Route path="/faceid" element={<FacialRecTest />} />
          <Route path="/logs" element={<ViewLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
