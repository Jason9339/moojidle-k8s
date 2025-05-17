import { useCallback, useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";


const NO_SELECTED = -1;
import { FaEdit } from "react-icons/fa";

const BoardSideBar = ({ itemData, handleAddBoard }) => {
    const { state } = useLocation();
    
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
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        navigate("/discussion/delete/", {
                                                            state: {
                                                                boardId: board_id,
                                                                boardName: board_name,
                                                            }
                                                        });
                                                    }}
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
                            <MenuItem
                                className="addBoard"
                                onClick={handleAddBoard}
                            >
                                新增討論版
                            </MenuItem>

                        </SubMenu>

                    ))}
                
            </Menu >
        </StyledSidebar >
    );
};
export default BoardSideBar;

// 外層包一層，控制偏移與背景
const OuterWrapper = styled.div`
  margin-left: 32px;
  margin-top: 40px;
  background-color: #f9f9f9; /* 跟右側主區一致 */
  border-radius: 16px;
  padding: 12px;
  height: fit-content;
`;

// 內部 Sidebar 卡片樣式
const StyledSidebar = styled(Sidebar)`
  border-radius: 12px;
  background-color: #f1f5f9 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  .ps-sidebar-container {
    background-color: transparent !important;
  }

  .ps-menu-button {
    padding: 12px 20px;
    color: #111827;
    font-weight: 500;
    border-radius: 6px;
    margin: 2px 6px;
    transition: background-color 0.2s, color 0.2s;
  }

  .ps-menu-button:hover {
    background-color: #e5e7eb !important;
    color: #3b82f6 !important;
  }

  .ps-submenu-content {
    background-color: transparent !important;
  }

  .ps-submenu-content > ul > li {
    margin-top: 8px;
    margin-left: 8px;
  }

  .addBoard {
    color: #10b981;
  }

  .edit-icon {
    padding: 4px;
    cursor: pointer;
    color: #6b7280;
  }

  .edit-icon:hover {
    color: #3b82f6;
  }

  .selected-item {
    color: #6366f1 !important;
    font-weight: bold;
  }

  .normal-item {
    color: #111827;
  }
`;