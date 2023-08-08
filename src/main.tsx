import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './css/index.css'
import Home from './tsx/Home.jsx'
import Play from './tsx/Play.js';
import Error from './tsx/Error.js';

const router = createBrowserRouter([
  { path: "/", element: <Home/>, errorElement:<Error/>},
  { path: "/play", element: <Play/>, errorElement:<Error/>},
  {path: "*", element: <Error/>}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <RouterProvider router={router}/>
  </React.StrictMode>,
)