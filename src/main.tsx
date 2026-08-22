import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary, RouteErrorFallback } from "./components/ErrorBoundary";
import { NotFound } from "./components/NotFound";
import { toDaySlug } from "./lib/slug";

const today = new Date();

// `errorElement` her rotaya ayrı verilir (createBrowserRouter'ın kendi
// dahili hata sınırını devre dışı bırakır) — bkz. RouteErrorFallback'in
// üstündeki not: bu, App.tsx'in kendi render'ında oluşan bir hatayı da
// kapsayan, gerçekten etkili olan katmandır.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/${toDaySlug(today.getMonth() + 1, today.getDate())}`} replace />,
    errorElement: <RouteErrorFallback />,
  },
  { path: "/:daySlug", element: <App />, errorElement: <RouteErrorFallback /> },
  { path: "*", element: <NotFound />, errorElement: <RouteErrorFallback /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);
