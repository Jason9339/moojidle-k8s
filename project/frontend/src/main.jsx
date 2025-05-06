import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/Layout";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";
import DiscussionBoardList from "@/pages/DiscussionBoardList";
import GithubCommentEditor from "@/components/TextEditor"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "discussion", element: <DiscussionBoardList /> },
            { path: "discussion/:id", element: <DiscussionBoard /> },
            { path: "text", element: <GithubCommentEditor /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <div className="text-7x1 text-cyan-50">Hello</div>
        <RouterProvider router={router} />
    </StrictMode>
);
