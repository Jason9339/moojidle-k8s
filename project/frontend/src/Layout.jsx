import { Outlet } from "react-router-dom";
import LeftBar from "@/components/LeftBar/LeftBar";

function Layout() {
    return (
        <div style={{ height: "4000px", display: "flex" }}>
            <LeftBar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
