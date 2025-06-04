import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import styles from "./BoardSideBar.module.css";
const NO_SELECTED = -1;

const BoardSideBar = ({ itemData, handleAddBoard, handleEditBoard }) => {
    const { state } = useLocation();
    const [selectedID, setSelectedID] = useState(
        state == null ? NO_SELECTED : state.initBoardID
    );
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    function canEdit(index) {
        if (!itemData || !itemData[index]) return false;
        const course = itemData[index];
        return (
            course.teachers?.some((t) => t.user_id === userId) ||
            course.assistants?.some((a) => a.user_id === userId)
        );
    }

    return (
        <div className={styles.container}>
            <StyledSidebar breakPoint="md">
                <Menu
                    renderExpandIcon={({ open }) => (
                        <span>{open ? "−" : "+"}</span>
                    )}
                    menuItemStyles={{
                        button: ({ level, active }) => {
                            const baseColor = "#1f2937"; // text-gray-800
                            const activeColor = "#0e3c61";
                            return {
                                display: "flex",
                                alignItems: "flex-start",
                                padding: "10px 16px",
                                color: active
                                    ? `${activeColor} !important`
                                    : baseColor,
                                fontSize: level === 0 ? "16px" : "14px",
                                fontWeight: level === 0 ? "600" : "400",
                                borderLeft: active
                                    ? `4px solid ${activeColor}`
                                    : "4px solid transparent",
                                borderRadius: "6px",
                                backgroundColor: active
                                    ? "#e5e7eb"
                                    : "transparent",
                                margin: "2px 6px",
                                height: "auto",
                                minHeight: "40px",
                                transition: "background-color 0.2s, color 0.2s",

                                "&:hover": {
                                    backgroundColor: "#e5e7eb !important",
                                    color: "#0e3c61 !important",
                                },

                                ".ps-menu-label": {
                                    flexGrow: 1,
                                    overflow: "hidden",
                                    marginRight: "8px",
                                },
                                ".ps-menu-label > span": {
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    display: "block",
                                    lineHeight: "1.45",
                                },
                                ".ps-menu-suffix": {
                                    flexShrink: 0,
                                },
                            };
                        },
                        subMenuContent: {
                            backgroundColor: "transparent !important",
                        },
                    }}
                >
                    {itemData.map(
                        ({ course_id, course_name, boards }, index) => (
                            <SubMenu key={course_id} label={course_name}>
                                {boards.map(({ board_id, board_name }) => (
                                    <MenuItem
                                        key={board_id}
                                        active={selectedID === board_id}
                                        onClick={() => {
                                            setSelectedID(board_id);
                                            navigate(`/discussion/${board_id}`);
                                        }}
                                        suffix={
                                            canEdit(index) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditBoard(
                                                            {
                                                                course_id,
                                                                course_name,
                                                            },
                                                            {
                                                                board_id,
                                                                board_name,
                                                            }
                                                        );
                                                    }}
                                                    className="edit-icon-button"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                            )
                                        }
                                    >
                                        <span>{board_name}</span>
                                    </MenuItem>
                                ))}
                                {canEdit(index) && (
                                    <MenuItem
                                        className="addBoard"
                                        onClick={() =>
                                            handleAddBoard({
                                                course_id,
                                                course_name,
                                            })
                                        }
                                    >
                                        新增討論版
                                    </MenuItem>
                                )}
                            </SubMenu>
                        )
                    )}
                </Menu>
            </StyledSidebar>
        </div>
    );
};

export default BoardSideBar;

const StyledSidebar = styled(Sidebar)`
    width: 100% !important;
    height: 100%;
    max-height: inherit;
    background-color: #f9fafb !important;
    border-radius: 12px;
    display: flex;
    flex-direction: column;

    .ps-sidebar-container {
        background-color: transparent !important;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .ps-menu-root {
        flex-grow: 1;
        overflow-y: scroll;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #a0aec0;
            border-radius: 10px;
            border: 2px solid #f1f5f9;
        }
        &::-webkit-scrollbar-thumb:hover {
            background-color: #718096;
        }
        scrollbar-width: thin;
        scrollbar-color: #a0aec0 #f1f5f9;
    }

    .ps-submenu-content {
        overflow-x: hidden !important;
    }

    .addBoard > .ps-menu-button {
        color: #3b82f6 !important; /* 藍色 base */
    }

    .addBoard > .ps-menu-button:hover {
        color: #2563eb !important; /* 藍色 hover */
        background-color: #e5e7eb !important;
    }

    .edit-icon-button {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: #6b7280;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .edit-icon-button:hover {
        color: #3b82f6;
    }
`;
