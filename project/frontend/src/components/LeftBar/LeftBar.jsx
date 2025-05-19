import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import styles from "./LeftBar.module.css";

// Icons
import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaUser, FaBook } from "react-icons/fa";
import { FaUserGroup, FaRegCalendarDays } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";

import LeftbarPopup from "@/components/user_components/LeftbarPopup/LeftbarPopup";

function LeftBar() {
    const [showUser, setShowUser] = useState(false);
    const navigate = useNavigate();

    const toggleShowUser = () => {
        setShowUser(!showUser);
    };

    return (
        <>
            {showUser && <LeftbarPopup onClose={() => setShowUser(false)} />}
            <div className="top-0 left-0 z-50 h-screen w-[180px]">
                <Sidebar className={`!h-full ${styles.sidebar}`} width="180px">
                    <div className={styles.headerContainer}>
                        {/* <img
                            src="/Logo/moojidle-logo-sidebar.png"
                            alt="Moojidle Logo"
                            className={styles.logo}
                        /> */}
                        <h1 className={styles.projectName}>Moojidle</h1>
                    </div>
                    <Menu>
                        <MenuItem icon={<FaUser />} onClick={toggleShowUser} className={styles.menuItem}>使用者</MenuItem>
                        <MenuItem icon={<MdOutlineSpaceDashboard />} onClick={() => navigate("/dashboard")} className={styles.menuItem}>儀表板</MenuItem>
                        <MenuItem icon={<FaBook />} onClick={() => navigate("/course")} className={styles.menuItem}>課程</MenuItem>
                        <MenuItem icon={<FaUserGroup />} onClick={() => navigate("/group")} className={styles.menuItem}>小組</MenuItem>
                        <MenuItem icon={<FaRegCalendarDays />} onClick={() => navigate("/calendar")} className={styles.menuItem}>行事曆</MenuItem>
                        <MenuItem icon={<MdOutlineMailOutline />} onClick={() => navigate("/inbox")} className={styles.menuItem}>通知</MenuItem>
                        <MenuItem icon={<GoCommentDiscussion />} onClick={() => navigate("/discussion/home")} className={styles.menuItem}>討論版</MenuItem>
                    </Menu>
                </Sidebar>
            </div>
        </>
    );
}

export default LeftBar;
