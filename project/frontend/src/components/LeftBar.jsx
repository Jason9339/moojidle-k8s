import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { leftBarNavItems } from "@/constants/LeftBarNavItems";
import { Link } from "react-router-dom";

function LeftBar() {
  return (
    <Sidebar>
      <Menu>
        {leftBarNavItems.map((item) => {
           return <MenuItem key={item.path} icon=<item.icon/> component={<Link to={item.path} className="link"/>}>{item.label}</MenuItem>
        })}
      </Menu>
    </Sidebar>
  );
}

export default LeftBar;
