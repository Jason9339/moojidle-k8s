import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// According to https://medium.com/@weiyun0912/react-protected-routes-%E4%BB%8B%E7%B4%B9%E8%88%87%E4%BD%BF%E7%94%A8-ed90ac88f9ea

const ProtectedRoutes = ({ login }) => {
    return login ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;