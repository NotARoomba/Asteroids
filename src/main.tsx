import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/index.css";
import Home from "./tsx/pages/Home.js";
import Play from "./tsx/pages/Play.js";
import Error from "./tsx/pages/Error.js";
import Leaderboard from "./tsx/pages/Leaderboard.js";

const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <Error /> },
  { path: "/play", element: <Play />, errorElement: <Error /> },
  { path: "/leaderboard", element: <Leaderboard />, errorElement: <Error /> },
  { path: "*", element: <Error /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
