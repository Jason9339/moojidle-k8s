import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/discussion_board_pages/DiscussionBoardPage/DiscussionBoardPage";
import Dashboard from "@/pages/Dashboard";
import Blank from "@/pages/Blank";
import PostEdit from "@/pages/post_pages/PostEdit";
import PostPage from "@/pages/post_pages/PostPage/PostPage";
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
                        <Route path="*" element={<NotFoundPage />} />

                        {/* user pages related */}
                        <Route path="/user/update-password" element={<UpadatePassword />} />
                        <Route path="/user/profile" element={<UserProfile />} />

                        {/* discussion board pages related */}
                        <Route path="/discussion/" element={<DiscussionBoard />} />
                        <Route path="/discussion/:param" element={<DiscussionBoard />} />
                        <Route path="/discussion/create" element={<CreateDiscussion />} />
                        <Route path="/discussion/delete" element={<DeleteDiscussion />} />

                        {/* post pages relayed */}
                        <Route path="/post-edit/:param" element={<PostEdit />} />
                        <Route path="/post/:id" element={<PostPage />} />
                    </Route>
                </Routes>
            </Router>
        </div >
    );
}

export default App;
