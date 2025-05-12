import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Icon
import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaUser, FaBook } from "react-icons/fa";
import { FaUserGroup, FaRegCalendarDays } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import LeftbarPopup from "@/components/user_components/LeftbarPopup/LeftbarPopup";

function LeftBar() {
    const [show, setShow] = useState(true);
    const [showUser, setShowUser] = useState(false);
    const navigate = useNavigate();

    const toggleShowUser = () => {
        setShowUser(!showUser);
    }

    return (
        <>
            {showUser ? <LeftbarPopup onClose={() => setShowUser(false)} /> : <></>}
            <div className="top-0 left-0 z-50 h-screen w-[180px]">
                <Sidebar className="!h-full" width="180px">
                    <Menu>
                        <MenuItem icon=<FaUser /> onClick={toggleShowUser}>使用者</MenuItem>

                        <MenuItem icon=<MdOutlineSpaceDashboard /> onClick={() => navigate("/")}>儀表板</MenuItem>
                        <MenuItem icon=<FaBook /> onClick={() => navigate("/course")}>課程</MenuItem>
                        <MenuItem icon=<FaUserGroup /> onClick={() => navigate("/group")}>小組</MenuItem>
                        <MenuItem icon=<FaRegCalendarDays /> onClick={() => navigate("/calendar")}>行事曆</MenuItem>
                        <MenuItem icon=<MdOutlineMailOutline /> onClick={() => navigate("/inbox")}>通知</MenuItem>
                        <MenuItem icon=<GoCommentDiscussion /> onClick={() => navigate("/discussion/home")}>討論版</MenuItem>
                    </Menu>
                </Sidebar>
            </div >

        </>
    );
}

export default LeftBar;
