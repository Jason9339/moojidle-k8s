import { Outlet, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";
import NotFoundPage from "@/pages/NotFoundPage";
import DiscussionBoard from "@/pages/DiscussionBoard";
import Dashboard from "@/pages/Dashboard";
import DiscussionBoardList from "@/pages/DiscussionBoardList";

import ProtectedRoutes from "@/utils/ProtectedRoutes";

function App() {
    let login;

    if(localStorage.getItem("user") == null){
        login = false;
    }else{
        login = true;
    }

    // for sprint 1 we set login to true for testing purpose
    login = true;

    return (
        <div className="flex">
            <Router>
                <LeftBar />
                <Routes>
                    <Route path="/"/>

                    <Route element={<ProtectedRoutes login={login} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/discussion/:id" element={<DiscussionBoard />} />
                        <Route path="/discussion" element={<DiscussionBoardList />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
            <main className="flex-1">
                <Outlet />
            </main>
        </div >
    );
}

export default App;
