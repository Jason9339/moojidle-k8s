import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { GetBoardsGroupByCourseByUserID } from "@/services/BoardApi/BoardApi"

const NO_SELECTED = -1;
import { FaEdit } from "react-icons/fa";
function BoardSideBar() {

    const { state } = useLocation();

    // Whether a MenuItem is currently selectewd
    const [selectedID, setSelectedID] = useState((state == null) ? NO_SELECTED : state.initBoardID);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*
     *  Data from backend
     *
     * [
     *  {course_id, course_name, boards : [{board_id, board_name}, ...]}
     * ]
     *
     */
    const [itemData, setItemData] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchItemData = async () => {
            try {

                // TODO uncomment this after creating backend api. 
                // const userID = 1;
                // const data = GetBoardsGroupByCourseByUserID(userID);
                const data = [
                    {
                        course_id: 1,
                        course_name: "電腦圖學",
                        boards: [{ board_id: 1, board_name: "Assign1" }, { board_id: 2, board_name: "Final" }]
                    },
                ];
                setItemData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItemData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <StyledSidebar>
            <Menu renderExpandIcon={({ open }) => <span>{open ? '-' : '+'}</span>}
                menuItemStyles={{
                    button: ({ level }) => {
                        if (level === 0) return {
                            fontSize: "1.5rem",
                            textAlign: "center"
                        };

                        if (level === 1) return {
                            fontSize: "1rem",
                            textAlign: "right"
                        };
                    }
                }}
            >

                {
                    itemData.map(({ course_id, course_name, boards }) => (

                        <SubMenu key={course_id} label={course_name} className="bg-[#1f2a40]">

                            {
                                boards.map(({ board_id, board_name }) => (

                                    <MenuItem
                                        key={board_id}


                                        className={selectedID === board_id ? "text-[#5961d4]" : "text-white"}
                                        suffix={
                                            <div key={`container-${board_id}`} className="flex space-x-2" >
                                                <button key={`${board_id}-btn1`}
                                                    className={`flex-1 hover:cursor-pointer hover:text-[#5961d4] ${selectedID === board_id ? "text-[#5961d4]" : "text-white"}`}
                                                    onClick={() => {
                                                        setSelectedID(board_id);
                                                        navigate(`/discussion/${board_id}`)
                                                    }}>

                                                    {board_name}
                                                </button>

                                                {/* TODO Edit Board (Delete in Sprint 1) */}
                                                <button
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        alert("Delete Board")
                                                    }}
                                                    className="px-2 py-1 text-sm rounded hover:bg-gray-700 hover:cursor-pointer text-white"
                                                >
                                                    <FaEdit className="inline w-4 h-4" />
                                                </button>
                                            </div>
                                        }
                                    >


                                    </MenuItem>
                                ))

                            }
                            <MenuItem className="addBoard" onClick={
                                () => {
                                    alert("Add Board")
                                }
                            }>
                                新增討論版
                            </MenuItem>

                        </SubMenu>

                    ))



                }
            </Menu >
        </StyledSidebar >
    );
}
export default BoardSideBar;

const StyledSidebar = styled(Sidebar)`
    height: 100vh !important;

    .ps-menu-label {
        margin: 0;
        width : 100%;
    }
    .ps-sidebar-container {
        background-color: #1f2a40 !important;
    }

    .ps-menu-button {
        padding: 12px 20px;
        color: #ffffff;
        font-weight: bold;
        transition: background-color 0.2s, color 0.2s;
        display: flex;
  
    }

    .ps-menu-button:hover {
    background-color: #1f2a40 !important;
    color: #5961d4 !important;
    }




    .ps-submenu-content {
    background-color: #1f2a40 !important;
    }
    .ps-submenu-root > .ps-menu-button {
    background-color: #1f2a40 !important;
    }

`;
