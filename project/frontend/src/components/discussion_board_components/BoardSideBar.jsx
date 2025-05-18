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
            {/* StyledSidebar will take 100% width of OuterWrapper. Width prop removed from here. */}
            <StyledSidebar breakPoint="md">
                <Menu
                    renderExpandIcon={({ open }) => <span>{open ? "−" : "+"}</span>}
                    menuItemStyles={{
                        button: ({ level, active }) => {
                            let styles = {
                                padding: "12px 20px", // Padding inside each menu button
                                color: "#111827",
                                fontWeight: 500,
                                borderRadius: "6px",
                                margin: "2px 6px", // Margin around each menu button
                                transition: "background-color 0.2s, color 0.2s",
                                "&:hover": {
                                    backgroundColor: "#e5e7eb !important",
                                    color: "#3b82f6 !important",
                                },
                                '.ps-menu-label': { // Container for the text label
                                    flexGrow: 1,
                                    overflow: 'hidden', // For text ellipsis or wrapping
                                    marginRight: '8px', // Space before suffix
                                },
                                '.ps-menu-label > span': { // The actual text span
                                    whiteSpace: 'normal', // Allow text to wrap
                                    wordBreak: 'break-word', // Break words to prevent overflow
                                    display: 'block', // Ensures it takes block space for wrapping
                                },
                                '.ps-menu-suffix': { // Container for the suffix (edit icon)
                                    flexShrink: 0, // Prevent suffix from shrinking
                                }
                            };
                            if (active) {
                                styles.color = "#6366f1 !important";
                                styles.fontWeight = "bold";
                            }
                            return styles;
                        },
                        subMenuContent: { // Styles for the content of SubMenu
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
                                                    e.stopPropagation(); // Prevent MenuItem click
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
                                    {/* The span for board_name is styled via menuItemStyles '.ps-menu-label > span' */}
                                    <span>{board_name}</span>
                                </MenuItem>
                            ))}
                            {canEdit(index) ? (
                                <MenuItem
                                    className="addBoard" // Custom class for "Add Board"
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

// Styled Components Definitions:

const OuterWrapper = styled.div`
  /* --- ADJUST THE WIDTH OF THE SIDEBAR HERE --- */
  width: 250px; /* Example: Set to 200px, 180px, etc., to make it narrower */
  /* ------------------------------------------- */

  margin-left: 28px;
  margin-top: 40px;
  margin-right: 16px;
  background-color: #f9f9f9; /* Outer card background */
  border-radius: 16px;      /* Outer card radius */
  max-height: calc(100vh - 80px); /* Adjust 80px based on your layout's top space */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Crucial: OuterWrapper itself should not scroll, clips StyledSidebar's corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
  flex-shrink: 0; /* Prevent shrinking in the main page's flex layout */
`;

const StyledSidebar = styled(Sidebar)`
  width: 100% !important; /* Fill the width defined by OuterWrapper */
  height: 100%;           /* Fill the height defined by OuterWrapper's max-height */
  
  background-color: #f1f5f9 !important; /* Sidebar's own content background */
  border-radius: 12px; /* Inner card radius, should be <= OuterWrapper's radius for nice effect */

  display: flex;
  flex-direction: column;

  .ps-sidebar-container {
    background-color: transparent !important; /* Container inside react-pro-sidebar, keep transparent */
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .ps-menu-root {
      flex-grow: 1; /* Allows menu to take available space and scroll */
      overflow-y: auto; /* Vertical scroll for menu items */
      overflow-x: hidden; /* No horizontal scroll for menu items */

      /* Custom Scrollbar Styles */
      &::-webkit-scrollbar {
        width: 8px; /* Width of the scrollbar */
      }

      &::-webkit-scrollbar-track {
        background: transparent; /* Track transparent or match StyledSidebar background */
        border-radius: 10px; 
      }

      &::-webkit-scrollbar-thumb {
        background-color: #a0aec0; /* Thumb color */
        border-radius: 10px; 
        /* Border helps thumb appear inset or thinner if track is same color as sidebar */
        border: 2px solid #f1f5f9; /* Border color same as StyledSidebar background */
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: #718096; /* Thumb color on hover */
      }

      /* For Firefox */
      scrollbar-width: thin; /* 'auto', 'thin', or 'none' */
      scrollbar-color: #a0aec0 #f1f5f9; /* thumb_color track_color (track matches StyledSidebar bg) */
  }

  .ps-submenu-content {
    overflow-x: hidden !important; /* Prevent horizontal scroll in submenu content */
  }

  /* Styling for the "Add Board" MenuItem button */
  .addBoard > .ps-menu-button { /* Targets the button inside the MenuItem with class "addBoard" */
      color: #10b981 !important; 
  }
  .addBoard > .ps-menu-button:hover {
      color: #059669 !important; /* Darker green on hover */
      background-color: #e5e7eb !important; /* Keep hover background consistent */
  }

  /* Styling for the edit icon button itself */
  .edit-icon-button {
    background: none;
    border: none;
    padding: 4px; /* Clickable area */
    cursor: pointer;
    color: #6b7280; /* Icon color */
    display: inline-flex; 
    align-items: center;
    justify-content: center;
  }

  .edit-icon-button:hover {
    color: #3b82f6; /* Icon color on hover */
  }
`;