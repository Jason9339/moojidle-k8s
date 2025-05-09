<<<<<<< HEAD
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/Layout";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard/Dashboard";
import DiscussionBoardList from "@/pages/DiscussionBoardList";

import CoursePage from "@/pages/CoursePage/CoursePage";
import CourseDetail from "@/pages/CourseDetail/CourseDetail";
import LeftBar from "./components/LeftBar/LeftBar";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "course", element: <CoursePage /> },
      { path: "course/:courseId", element: <CourseDetail /> },
      { path: "discussion", element: <DiscussionBoardList /> },
      { path: "discussion/:id", element: <DiscussionBoard /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
>>>>>>> main
