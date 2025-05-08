import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "@/Layout";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";
import DiscussionBoardList from "@/pages/DiscussionBoardList";
import Register from "@/pages/login_register_pages/Register.jsx";
import Login from "@/pages/login_register_pages/Login.jsx";
import LeftBar from "./components/LeftBar/LeftBar";

// pages for user related
import UserProfile from "@/pages/user_pages/UserProfile/UserProfile.jsx";
import UpadatePassword from "@/pages/user_pages/UserUpdatePassword/UserUpdatePassword.jsx";
const isAuthenticated = () => {
    return localStorage.getItem("user") !== null; // Check if user is logged in
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
    {
        path: "/",
        // element: <Navigate to="/login" replace />,
        element: <Layout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "discussion", element: <DiscussionBoardList /> },
            { path: "discussion/:id", element: <DiscussionBoard /> },
            { path: "*", element: <NotFoundPage /> },

            // user related
            { path: "user/profile", element: <UserProfile /> },
            { path: "user/update-password", element: <UpadatePassword /> }
        ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
