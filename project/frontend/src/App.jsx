import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";
import DiscussionBoardList from "@/pages/DiscussionBoardList";
import Blank from "@/pages/Blank";

import ProtectedRoutes from "@/utils/ProtectedRoutes";

// pages for user related
import UserProfile from "@/pages/user_pages/UserProfile/UserProfile.jsx";
import UpadatePassword from "@/pages/user_pages/UserUpdatePassword/UserUpdatePassword.jsx";
import Register from "@/pages/login_register_pages/Register.jsx";
import Login from "@/pages/login_register_pages/Login.jsx";

function App() {
    let login;

    if (localStorage.getItem("user") == null) {
        login = false;
    } else {
        login = true;
    }

    return (
        <div className="flex">
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoutes login={login} />} >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/discussion/:id" element={<DiscussionBoard />} />
                        <Route path="/discussion" element={<DiscussionBoardList />} />
                        <Route path="*" element={<NotFoundPage />} />

                        {/* user pages related */}
                        <Route path="/user/update-password" element={<UpadatePassword />} />
                        <Route path="/user/profile" element={<UserProfile />} />
                    </Route>
                </Routes>
            </Router>
        </div >
    );
}

export default App;
