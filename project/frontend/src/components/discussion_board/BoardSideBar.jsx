import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { GetBoardsGroupByCourseByUserID } from "@/services/BoardApi/BoardApi"

const SELECT_ALL_ID = -1;
function BoardSideBar() {

    const { state } = useLocation();
    const [selectedID, setSelectedID] = useState((state == null) ? SELECT_ALL_ID : state.initBoardID);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemData, setItemData] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchItemData = async () => {
            try {

                const userID = 1;
                const data = GetBoardsGroupByCourseByUserID(userID);

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
                <MenuItem
                    onClick={() => {
                        setSelectedID(SELECT_ALL_ID);
                        navigate("/discussion/all");
                    }}

                    className={selectedID === SELECT_ALL_ID ? "text-[#5961d4]" : "text-white"}
                >
                    所有
                </MenuItem>


                {
                    itemData.map(({ course_id, course_name, boards }) => (

                        <SubMenu key={course_id} label={course_name} className="bg-[#1f2a40]">

                            {
                                boards.map(({ board_id, board_name }) => (

                                    <MenuItem
                                        key={board_id}
                                        onClick={() => {
                                            setSelectedID(board_id);
                                            navigate(`/discussion/${board_id}`)
                                        }}

                                        className={selectedID === board_id ? "text-[#5961d4]" : "text-white"}

                                    >
                                        {board_name}
                                    </MenuItem>
                                ))

                            }
                            <MenuItem className="addBoard">
                                新增討論版
                            </MenuItem>

                        </SubMenu>

                    ))



                }
            </Menu>
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
