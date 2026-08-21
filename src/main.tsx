import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { NotFound } from "./components/NotFound";
import { toDaySlug } from "./lib/slug";

const today = new Date();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/${toDaySlug(today.getMonth() + 1, today.getDate())}`} replace />,
  },
  { path: "/:daySlug", element: <App /> },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
