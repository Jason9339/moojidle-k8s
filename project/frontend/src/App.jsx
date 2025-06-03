import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CourseLayout from "@/pages/course_pages/CourseLayout/CourseLayout";
import CourseTab from "@/pages/course_pages/CourseTab/CourseTab";
import AssignmentsTab from "@/pages/course_pages/AssignmentsTab/AssignmentsTab";
import GradesTab from "@/pages/course_pages/GradesTab/GradesTab";
import AnnouncementsTab from "@/pages/course_pages/AnnouncementsTab/AnnouncementsTab";
import MembersTab from "@/pages/course_pages/MembersTab/MembersTab";
import DiscussionTab from "@/pages/course_pages/DiscussionTab/DiscussionTab";
import ExamsTab from "@/pages/course_pages/ExamsTab/ExamsTab";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoardPage/DiscussionBoardPage";
import Blank from "@/pages/Blank";
import PostEdit from "@/pages/post_pages/PostEdit";
import PostPage from "@/pages/post_pages/PostPage/PostPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import CoursePage from "@/pages/course_pages/CoursePage/CoursePage";
import ProtectedRoutes from "@/utils/ProtectedRoutes";

// pages for user related
import UserProfile from "@/pages/user_pages/UserProfile/UserProfile.jsx";
import UpadatePassword from "@/pages/user_pages/UserUpdatePassword/UserUpdatePassword.jsx";
import Register from "@/pages/login_register_pages/Register/Register.jsx";
import Login from "@/pages/login_register_pages/Login/Login.jsx";

// pages for calendar
import CalendarPage from "@/pages/calendar_pages/CalendarPage/CalendarPage";
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

                        <Route path="/course/:courseId" element={<CourseLayout />}>
                            {/* index route（預設子頁面）*/}
                            <Route index element={<CourseTab />} />
                            <Route path="assignment" element={<AssignmentsTab />} />
                            <Route path="grade" element={<GradesTab />} />
                            <Route path="announcement" element={<AnnouncementsTab />} />
                            <Route path="members" element={<MembersTab />} />
                            <Route path="discussion" element={<DiscussionTab />} />
                            <Route path="exams" element={<ExamsTab />} />
                        </Route>

                        {/* user pages related */}
                        <Route path="/user/update-password" element={<UpadatePassword />} />
                        <Route path="/user/profile" element={<UserProfile />} />

                        {/* discussion board pages related */}
                        <Route path="/discussion/" element={<DiscussionBoard />} />
                        <Route path="/discussion/:param" element={<DiscussionBoard />} />

                        {/* post pages related */}
                        <Route path="/post-edit/:post_id" element={<PostEdit />} />
                       
                        <Route path="/post/:id" element={<PostPage />} />

                        {/* calendar pages related */}
                        <Route path="/calendar" element={<CalendarPage />} />
                    </Route>
                </Routes>
            </Router>
        </div >
    );
}

export default App;
