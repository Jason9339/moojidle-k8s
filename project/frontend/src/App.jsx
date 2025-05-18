import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/discussion_board_pages/DiscussionBoardPage/DiscussionBoardPage";
import Blank from "@/pages/Blank";
import PostEdit from "@/pages/post_pages/PostEdit";
import PostPage from "@/pages/post_pages/PostPage/PostPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Blank from "@/pages/Blank";
import CoursePage from "@/pages/CoursePage/CoursePage";
import CourseDetail from "@/pages/CourseDetail/CourseDetail";
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
                    <Route path="/" element={<Blank />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoutes login={login} />} >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFoundPage />} />
                        
                        {/* course page related */}
                        <Route path="/course" element={<CoursePage />} />
                        <Route path="/course/:courseId" element={<CourseDetail />} />

                        {/* user pages related */}
                        <Route path="/user/update-password" element={<UpadatePassword />} />
                        <Route path="/user/profile" element={<UserProfile />} />

                        {/* discussion board pages related */}
                        <Route path="/discussion/" element={<DiscussionBoard />} />
                        <Route path="/discussion/:param" element={<DiscussionBoard />} />

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
