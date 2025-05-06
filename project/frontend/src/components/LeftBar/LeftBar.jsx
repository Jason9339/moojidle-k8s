import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { leftBarNavItems } from "@/constants/LeftBarNavItems";
import { Link } from "react-router-dom";
// import './LeftBar.css' to import the styles
import './test.css'

function LeftBar() {
    return (
        <Sidebar className="fixed top-0 left-0">
            <Menu>
                {leftBarNavItems.map((item) => (
                    <MenuItem
                        key={item.path}
                        icon={<item.icon />}
                        component={<Link to={item.path} />}
                        className="py-3 px-5 font-bold"
                        activeClassName="!text-[#5961d4]"
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
            <div className="!bg-transparent">
                {/* if you have an icon wrapper elsewhere */}
            </div>
        </Sidebar>
    );
}

export default LeftBar;
