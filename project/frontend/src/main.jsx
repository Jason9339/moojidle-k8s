import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/Layout";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "discussion/:param", element: <DiscussionBoard /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
