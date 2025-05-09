import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard/Dashboard";
import DiscussionBoardList from "@/pages/DiscussionBoardList";
import Blank from "@/pages/Blank";
import CoursePage from "@/pages/CoursePage/CoursePage";
import CourseDetail from "@/pages/CourseDetail/CourseDetail";
import ProtectedRoutes from "@/utils/ProtectedRoutes";

function App() {
    let login;

    if (localStorage.getItem("user") == null) {
        login = false;
    } else {
        login = true;
    }

    // for sprint 1 we set login to true for testing purpose
    login = true;

    return (
        <div className="flex">
            <Router>
                <Routes>
                    <Route path="/" element={<Blank />} />

                    <Route element={<ProtectedRoutes login={login} />} >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/course" element={<CoursePage />} />
                        <Route path="/course/:courseId" element={<CourseDetail />} />
                        <Route path="/discussion/:id" element={<DiscussionBoard />} />
                        <Route path="/discussion" element={<DiscussionBoardList />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
        </div >
    );
}

export default App;
