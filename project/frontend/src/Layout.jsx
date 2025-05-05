import { Outlet } from "react-router-dom";
import LeftBar from "@/components/LeftBar";

function Layout() {
  return (
    <div style={{ display: "flex" }}>
      <LeftBar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
