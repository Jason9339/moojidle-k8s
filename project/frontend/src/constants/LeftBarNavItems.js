import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaUser, FaBook } from "react-icons/fa";
import { FaUserGroup, FaRegCalendarDays } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";


export const leftBarNavItems = [
    // {label : "", icon : FaUser, }
    {label : "儀表板", icon : MdOutlineSpaceDashboard, path : "/"},
    {label : "課程" , icon : FaBook, path : "/course"},
    {label : "小組" , icon : FaUserGroup, path : "/group"},
    {label : "行事曆", icon : FaRegCalendarDays, path : "/calendar" },
    {label : "通知", icon : MdOutlineMailOutline, path : "/inbox"},
    {label : "討論版", icon : GoCommentDiscussion , path : "/discussion"},
];