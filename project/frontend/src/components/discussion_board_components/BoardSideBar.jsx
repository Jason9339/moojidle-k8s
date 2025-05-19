import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

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
        if (course.teachers?.some(teacher => teacher.user_id === userId)) {
            return true;
        }
        if (course.assistants?.some(assistant => assistant.user_id === userId)) {
            return true;
        }
        return false;
    }

    return (
        <OuterWrapper>
            <StyledSidebar breakPoint="md">
                <Menu
                    renderExpandIcon={({ open }) => <span>{open ? "−" : "+"}</span>}
                    menuItemStyles={{
                        button: ({ level, active }) => {
                            let styles = {
                                // --- Overall Button Styling ---
                                display: 'flex',        // Crucial for aligning label and suffix
                                alignItems: 'flex-start', // Align items to the top if content wraps
                                padding: "12px 20px", 
                                color: "#111827",
                                fontWeight: 500,
                                borderRadius: "6px",
                                margin: "2px 6px", 
                                transition: "background-color 0.2s, color 0.2s",
                                height: 'auto',         // Allow button height to grow with content
                                minHeight: '40px',      // Optional: ensure a minimum touch target size

                                "&:hover": {
                                    backgroundColor: "#e5e7eb !important",
                                    color: "#3b82f6 !important",
                                },

                                // --- Text Label Styling ---
                                '.ps-menu-label': { 
                                    flexGrow: 1,
                                    // overflow: 'hidden', // Keep hidden if you prefer to clip truly excessive text
                                    overflow: 'visible', // Set to visible to ensure parent grows
                                    marginRight: '8px', 
                                },
                                '.ps-menu-label > span': { 
                                    whiteSpace: 'normal', 
                                    wordBreak: 'break-word', 
                                    display: 'block', 
                                    lineHeight: '1.45', // Adjusted for better multi-line readability
                                },

                                // --- Suffix (Edit Icon) Styling ---
                                '.ps-menu-suffix': { 
                                    flexShrink: 0,
                                }
                            };
                            if (active) {
                                styles.color = "#6366f1 !important";
                                styles.fontWeight = "bold";
                            }

                            return styles;
                        },
                        subMenuContent: { 
                            backgroundColor: 'transparent !important',
                        },
                    }}
                >
                    {itemData.map(({ course_id, course_name, boards }, index) => (
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
                                        canEdit(index) ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleEditBoard(
                                                        { course_id: course_id, course_name: course_name },
                                                        { board_id: board_id, board_name: board_name }
                                                    );
                                                }}
                                                className="edit-icon-button" 
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                        ) : null
                                    }
                                >
                                    <span>{board_name}</span>
                                </MenuItem>
                            ))}
                            {canEdit(index) ? (
                                <MenuItem
                                    className="addBoard" 
                                    onClick={() => handleAddBoard({ course_id: course_id, course_name: course_name })}
                                >
                                    新增討論版
                                </MenuItem>
                            ) : null}
                        </SubMenu>
                    ))}
                </Menu>
            </StyledSidebar>
        </OuterWrapper>
    );
};
export default BoardSideBar;

const OuterWrapper = styled.div`
  width: 250px; 
  margin-left: 28px;
  margin-top: 40px;
  margin-right: 16px;
  background-color: #f9f9f9; 
  border-radius: 16px;      
  max-height: calc(100vh - 80px); 
  display: flex;
  flex-direction: column;
  overflow: hidden; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
  flex-shrink: 0; 
`;

const StyledSidebar = styled(Sidebar)`
  width: 100% !important; 
  height: 100%;         
  max-height: inherit;  
  background-color:rgba(223, 235, 255, 0.8) !important; 
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
      overflow-y: auto; 
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
      color: #10b981 !important; 
  }
  .addBoard > .ps-menu-button:hover {
      color: #059669 !important; 
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