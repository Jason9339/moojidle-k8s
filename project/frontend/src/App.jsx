import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";
import Blank from "@/pages/Blank";
import Post from "@/pages/Post";
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
                        <Route path="/discussion/:param" element={<DiscussionBoard />} />
                        <Route path="/post/:id" element={<Post />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
        </div >
    );
}

export default App;
