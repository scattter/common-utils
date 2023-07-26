import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {SSRProvider} from "./ssr/SSRProvider.tsx";

ReactDOM.hydrateRoot(document.getElementById('root')!,  <BrowserRouter>
  <React.StrictMode>
    <SSRProvider>
      <App />
    </SSRProvider>
  </React.StrictMode>
</BrowserRouter>)