import { Outlet } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";

function Layout() {
    return (
        <div className="flex">
            <LeftBar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div >
    );
}

export default Layout;
