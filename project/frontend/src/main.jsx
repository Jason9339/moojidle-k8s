import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/Layout";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";
import DiscussionBoardList from "@/pages/DiscussionBoardList";

// pages for user related
import UserProfile from "@/pages/user_pages/UserProfile.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "discussion", element: <DiscussionBoardList /> },
            { path: "discussion/:id", element: <DiscussionBoard /> },
            { path: "*", element: <NotFoundPage /> },

            // user related
            { path: "user/profile", element: <UserProfile /> }
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
