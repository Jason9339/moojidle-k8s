import LeftbarPopup from "@/components/user_components/LeftbarPopup/LeftbarPopup";

export const leftBarNavItems = [
    { label: "使用者", icon: FaUser, popup: LeftbarPopup },
    { label: "儀表板", icon: MdOutlineSpaceDashboard, path: "/" },
    { label: "課程", icon: FaBook, path: "/course" },
    { label: "小組", icon: FaUserGroup, path: "/group" },
    { label: "行事曆", icon: FaRegCalendarDays, path: "/calendar" },
    { label: "通知", icon: MdOutlineMailOutline, path: "/inbox" },
    { label: "討論版", icon: GoCommentDiscussion, path: "/discussion" },
];
