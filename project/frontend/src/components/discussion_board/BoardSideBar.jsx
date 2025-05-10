import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import styled from "styled-components";
import { Link } from "react-router-dom";
const Item = ({ title, icon, selected, setSelected, link }) => (
    <MenuItem
        active={selected === title}
        onClick={() => {
            setSelected(title);
        }}
        icon={icon}
        style={{
            color: selected === title ? "#5961d4" : "#FFFFFF",
        }}
        component={<Link to={link} />}
    >
        {title}
    </MenuItem>
);

function BoardSideBar() {
    const [selected, setSelected] = useState("所有");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // TODO get user involved courses.
                const courses = [
                    { course_id: 1, name: "電腦圖學" },
                    { course_id: 2, name: "圖論" },
                    { course_id: 3, name: "軟體工程" },
                ];
                setCourses(courses);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <StyledSidebar>
            <Menu>
                <Item
                    title="所有"
                    selected={selected}
                    setSelected={setSelected}
                    link={"/discussion/all"}
                />


                <SubMenu>


                </SubMenu>
                {courses.map(({ course_id, name }) => (
                    <Item
                        key={course_id}
                        title={name}
                        selected={selected}
                        setSelected={setSelected}
                        link={`/discussion/${course_id}`}
                    />
                ))}
            </Menu>
        </StyledSidebar>
    );
}
export default BoardSideBar;
/* ---------- styled-components ---------- */
const StyledSidebar = styled(Sidebar)`
    height: 100vh;

    .ps-sidebar-container {
        height: 100% !important;
        background-color: #1f2a40;
    }

    .ps-menu-button {
        padding: 12px 20px;
        color:#ffffff;
        font-weight: bold;
    }

    .ps-menu-button:hover {
        background-color: #1f2a40;
        color: #5961d4 !important;
    }

    .ps-menu-item-root.ps-active > .ps-menu-button {
        background-color: #2e3e6e;
        color: #5961d4 ;
    }

    .ps-icon-wrapper {
        background: transparent;
    }
`;
