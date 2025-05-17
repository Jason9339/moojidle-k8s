import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";


const NO_SELECTED = -1;
import { FaEdit } from "react-icons/fa";

const BoardSideBar = ({ itemData, handleAddBoard, handleEditBoard }) => {
    const { state } = useLocation();

    console.log("sidebar: itemdata=", itemData)
    // Whether a MenuItem is currently selectewd
    const [selectedID, setSelectedID] = useState((state == null) ? NO_SELECTED : state.initBoardID);

    /*
     *  Data from backend
     *
     * [
     *  {course_id, course_name, boards : [{board_id, board_name}, ...]}
     * ]
     *
     */
    const navigate = useNavigate()

    const userId = JSON.parse(localStorage.getItem("user")).user_id;

    // check if user is teacher or assistant
    function canEdit(index) {
        for (let i = 0; i < itemData[index].teachers.length; i++) {
            if (userId == itemData[index].teachers[i].user_id) {  // is a teacher
                return true;
            }
        }

        for (let i = 0; i < itemData[index].assistants.length; i++) {
            if (userId == itemData[index].assistants[i].user_id) {  // is an assistant
                return true;
            }
        }

        return false;
    }

    return (
        <StyledSidebar width="220px">
            <Menu renderExpandIcon={({ open }) => <span>{open ? '-' : '+'}</span>}
            >
                {
                    itemData.map(({ course_id, course_name, boards }, index) => (

                        <SubMenu key={course_id} label={course_name} className="text-white bg-[#1f2a40]">

                            {
                                boards.map(({ board_id, board_name }) => (

                                    <MenuItem
                                        key={board_id}
                                        className={selectedID === board_id ? "text-[#5961d4]" : "text-white"}
                                        onClick={() => {
                                            setSelectedID(board_id);
                                            navigate(`/discussion/${board_id}`);
                                        }}
                                        suffix={
                                            canEdit(index) ? (
                                                <button
                                                    onClick={() => handleEditBoard({ course_id: course_id, course_name: course_name }, { board_id: board_id, board_name: board_name })}
                                                    className="p-1 hover:text-[#5961d4] cursor-pointer"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                            ) : null
                                        }
                                    >
                                        <span >{board_name}</span>
                                    </MenuItem>))

                            }


                            {
                                canEdit(index) ? (
                                    <MenuItem
                                        className="addBoard"
                                        onClick={() => handleAddBoard({ course_id: course_id, course_name: course_name })}
                                    >
                                        新增討論版
                                    </MenuItem>

                                ) : null
                            }


                        </SubMenu>

                    ))}

            </Menu >
        </StyledSidebar >
    );
};
export default BoardSideBar;

const StyledSidebar = styled(Sidebar)`
    height: 100vh !important;

    .ps-menu-label {
    flex: 1 1 auto;
    min-width: 0;
    white-space: normal;
    word-break: break-word;
    line-height: 1.25rem;
    }

    .ps-menu-suffix {
    flex: 0 0 auto;
    margin-left: 0.5rem;
    }

    .ps-sidebar-container { background-color: #1f2a40 !important; }
    .ps-menu-button {
        padding: 12px 20px;
        color: #ffffff;
        font-weight: bold;
        transition: background-color 0.2s, color 0.2s;
    }
    .ps-menu-button:hover { background-color: #1f2a40 !important; color: #5961d4 !important; }
    .ps-submenu-content { background-color: #1f2a40 !important; }
    .ps-submenu-content > ul {
        display: flex;
        flex-direction: column;
    }

    .ps-submenu-content > ul > li {
        margin-top : 10px;

    }
`;

