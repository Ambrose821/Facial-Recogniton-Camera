import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'

import DefaultLayout from './Layouts/defaultLayout'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DefaultLayout/>}>
          <Route index element={<div>Hello from router</div>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
