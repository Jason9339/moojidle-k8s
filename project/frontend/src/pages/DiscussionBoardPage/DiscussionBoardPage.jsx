import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import BoardSideBar from "@/components/discussion_board_components/BoardSideBar/BoardSideBar";
import LeftBar from "@/components/LeftBar/LeftBar.jsx";
import DiscussionBoardInitContent from "@/components/discussion_board_components/DiscussionBoardInitContent/DiscussionBoardInitContent";
import DiscussionBoardContent from "@/components/discussion_board_components/DiscussionBoardContent/DiscussionBoardContent";
import CreateDiscussionBoardModal from "@/components/discussion_board_components/CreateDiscussionBoardModal/CreateDiscussionBoardModal";
import EditDiscussionBoardModal from "@/components/discussion_board_components/EditDiscussionBoardModal/EditDiscussionBoardModal";
import styles from "./DiscussionBoardPage.module.css";
import { LuPlus } from "react-icons/lu";

import { GetBoardsGroupByCourseByUserID } from "@/services/DiscussionBoardApi";
import { GetOverviewPostByBId } from "@/services/PostApi";

function DiscussionBoard() {
    const { param } = useParams();
    const [error, setError] = useState(null);
    const [courseBoardData, setCourseBoardData] = useState(null);
    const [overviewPostData, setOverviewPostData] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const userIdRef = useRef(null);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentBoard, setCurrentBoard] = useState(null);

    const fetchCourseBoards = async () => {
        try {
            const uid = JSON.parse(localStorage.getItem("user")).user_id;
            userIdRef.current = uid;

            const data = await GetBoardsGroupByCourseByUserID(uid);
            console.log(data);
            setCourseBoardData(data);
            setError(null);
        } catch (err) {
            setError("無法載入討論資料");
        }
    };

    const fetchOverviewPosts = async () => {
        try {
            const result = await GetOverviewPostByBId(parseInt(param));
            setOverviewPostData(result);
        } catch (err) {
            console.error("無法載入貼文摘要", err);
        }
    };

    useEffect(() => {
        fetchCourseBoards();
    }, []);

    useEffect(() => {
        if (param && param !== "home") {
            fetchOverviewPosts();
        }
    }, [param]);

    useEffect(() => {
        if (param && param !== "home" && courseBoardData) {
            const currentBoardId = parseInt(param);
            courseBoardData.forEach((course) => {
                course.boards.forEach((board) => {
                    if (board.board_id === currentBoardId) {
                        setCurrentCourse({
                            course_id: course.course_id,
                            course_name: course.course_name,
                        });
                        setCurrentBoard({
                            board_id: board.board_id,
                            board_name: board.board_name,
                        });
                    }
                });
            });
        }
    }, [courseBoardData, param]);

    const handleAddBoard = useCallback((course) => {
        setCurrentCourse(course);
        setShowCreatePopup(true);
    }, []);

    const handleEditBoard = useCallback((course, board) => {
        setCurrentBoard({
            board_id: board.board_id,
            board_name: board.board_name,
        });
        setCurrentCourse({
            course_id: course.course_id,
            course_name: course.course_name,
        });
        setShowEditPopup(true);
    }, []);

    if (error) {
        return (
            <div className={styles["app-layout"]}>
                <LeftBar />
                <div
                    className={styles["page-container"]}
                    style={{ backgroundColor: "#eff2f5" }}
                >
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    const isLoading = !courseBoardData;

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            {isLoading ? (
                <div
                    className={styles["page-container"]}
                    style={{ backgroundColor: "#eff2f5", flex: 1 }}
                />
            ) : (
                <div className={styles["page-container"]}>
                    {/* 頁面標題列 */}
                    <div className={styles["heading-row"]}>
                        <h2 className={styles["heading-title"]}>Discussion Board</h2>
                    </div>
                    <hr className={styles["heading-divider"]} />

                    {/* 主內容區 */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        <div className={styles.discussionPageLayout}>
                            <BoardSideBar
                                itemData={courseBoardData}
                                handleAddBoard={handleAddBoard}
                                handleEditBoard={handleEditBoard}
                            />
                        </div>

                        <div className={styles["main-container"]}>
                            {param === "home" || param == null ? (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                        height: "100%",
                                        paddingTop: "150px",
                                    }}
                                >
                                    <DiscussionBoardInitContent />
                                    <Link
                                        to="/post-edit/new"
                                        className={styles.fab}
                                        state={{ data: courseBoardData }}
                                        title="新增貼文"
                                    >
                                        <LuPlus />
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex">
                                    <DiscussionBoardContent
                                        overviewPosts={overviewPostData}
                                        courseName={currentCourse?.course_name}
                                        boardName={currentBoard?.board_name}
                                    />
                                    <Link
                                        to="/post-edit/new"
                                        className={styles.fab}
                                        state={{
                                            data: courseBoardData,
                                            current: {
                                                course: {
                                                    value: currentCourse?.course_id,
                                                    label: currentCourse?.course_name,
                                                },
                                                board: {
                                                    value: currentBoard?.board_id,
                                                    label: currentBoard?.board_name,
                                                },
                                            },
                                        }}
                                        title="新增貼文"
                                    >
                                        <LuPlus />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal 區 */}
                    {showCreatePopup && (
                        <CreateDiscussionBoardModal
                            courseId={currentCourse?.course_id}
                            userId={userIdRef.current}
                            onClose={() => {
                                setShowCreatePopup(false);
                                fetchCourseBoards();
                            }}
                        />
                    )}
                    {showEditPopup && (
                        <EditDiscussionBoardModal
                            boardId={currentBoard?.board_id}
                            onClose={() => {
                                setShowEditPopup(false);
                                fetchCourseBoards();
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default DiscussionBoard;
