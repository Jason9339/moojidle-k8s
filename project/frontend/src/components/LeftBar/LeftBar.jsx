import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { leftBarNavItems } from "@/constants/LeftBarNavItems";
import { Link } from "react-router-dom";

function LeftBar() {
    return (

        <div className="fixed top-0 left-0 z-50 !h-screen">
            <Sidebar className="!h-full">
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
            </Sidebar>
        </div>
    );
}

export default LeftBar;
