import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import BoardSideBar from "@/components/discussion_board_components/BoardSideBar";
import LeftBar from '@/components/LeftBar/LeftBar.jsx'
import DiscussionBoardInitContent from "@/components/discussion_board_components/DiscussionBoardInitContent/DiscussionBoardInitContent";
import DiscussionBoardContent from "@/components/discussion_board_components/DiscussionBoardContent/DiscussionBoardContent";
import CreateDiscussionBoardModal from "@/components/discussion_board_components/CreateDiscussionBoardModal/CreateDiscussionBoardModal";

import EditDiscussionBoardModal from "@/components/discussion_board_components/EditDiscussionBoardModal/EditDiscussionBoardModal";
import styles from "./DiscussionBoardPage.module.css";
import { LuPlus } from "react-icons/lu";

import { GetBoardsGroupByCourseByUserID } from "@/services/DiscussionBoardApi";
import { GetOverviewPostByBId } from "@/services/PostApi";
import { useRef } from "react";

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
            // TODO use Context to save userID
            const uid = JSON.parse(localStorage.getItem("user")).user_id;
            userIdRef.current = uid;


            const data = await GetBoardsGroupByCourseByUserID(userIdRef.current);
            setCourseBoardData(data);
            setError(null);
        } catch (err) {
            setError("無法載入討論資料");
        }
    };
    useEffect(() => {

        fetchCourseBoards();
    }, []);

    useEffect(() => {
        async function FetchOverviewPost() {
            const result = await GetOverviewPostByBId(parseInt(param));
            setOverviewPostData(result);
        }
        if (param != null && param != "home") {
            FetchOverviewPost();
        }
    }, [param]);


    useEffect(() => {
        // want to get over view posts
        if (param != null && param !== "home") {

            // find course name and board name
            const currentBoardId = parseInt(param);


            courseBoardData?.forEach((course) => {

                course.boards.forEach(board => {
                    if (board.board_id === currentBoardId) {

                        setCurrentCourse({ course_id: course.course_id, course_name: course.course_name });
                        setCurrentBoard({ board_id: board.board_id, board_name: board.board_name });
                    }
                });

            })

        }

    }, [courseBoardData, param]);

    const handleAddBoard = useCallback((course) => {

        setCurrentCourse(course);
        setShowCreatePopup(true);
    }, []);

    const handleEditBoard = useCallback((course, board) => {

        setCurrentBoard({ board_id: board.board_id, board_name: board.board_name });
        setCurrentCourse({ course_id: course.course_id, course_name: course.course_name });
        setShowEditPopup(true);
    }, [])

    if (error) return (<p className="text-red-500">{error}</p>);
    if (!courseBoardData) return (<p>Loading...</p>)

    return (
        <>
            <LeftBar />
            <div className={styles.discussionPageLayout}>
                <BoardSideBar itemData={courseBoardData || []} handleAddBoard={handleAddBoard} handleEditBoard={handleEditBoard} />
            </div>


            <div className={styles["main-container"]}>
                {
                    param == "home" || param == null ?
                        <div className="flex relative">
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
                        :
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
                                    data: courseBoardData, current: {
                                        course: { value: currentCourse?.course_id, label: currentCourse?.course_name },
                                        board: { value: currentBoard?.board_id, label: currentBoard?.board_name }
                                    }
                                }}

                                title="新增貼文"
                            >
                                <LuPlus />
                            </Link>
                        </div >
                }
            </div >


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


            {
                showEditPopup && (
                    <EditDiscussionBoardModal
                        boardId={currentBoard?.board_id}
                        onClose={() => {
                            setShowEditPopup(false)
                            fetchCourseBoards();
                        }}
                    />
                )
            }

        </>
    );
}

export default DiscussionBoard;
