import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/discussion_board_pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";
import Blank from "@/pages/Blank";
import Post from "@/pages/post_pages/Post";
import ProtectedRoutes from "@/utils/ProtectedRoutes";

// pages for user related
import UserProfile from "@/pages/user_pages/UserProfile/UserProfile.jsx";
import UpadatePassword from "@/pages/user_pages/UserUpdatePassword/UserUpdatePassword.jsx";
import Register from "@/pages/login_register_pages/Register.jsx";
import Login from "@/pages/login_register_pages/Login.jsx";
import CreateDiscussion from "@/pages/discussion_board_pages/CreateDiscussionBoard/CreateDiscussionBoard.jsx";        
import DeleteDiscussion from "@/pages/discussion_board_pages/DeleteDiscussionBoard/DeleteDiscussionBoard.jsx";  

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
                    <Route path="/" element={<Blank />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoutes login={login} />} >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/discussion/:param" element={<DiscussionBoard />} />
                        <Route path="/discussion/create" element={<CreateDiscussion />} />
                        <Route path="/discussion/delete" element={<DeleteDiscussion />} />
                        <Route path="/post/:id" element={<Post />} />
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
