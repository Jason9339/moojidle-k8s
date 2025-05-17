import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import BoardSideBar from "@/components/discussion_board_components/BoardSideBar";
import LeftBar from '@/components/LeftBar/LeftBar.jsx'
import DiscussionBoardInitContent from "@/components/discussion_board_components/DiscussionBoardInitContent/DiscussionBoardInitContent";
import DiscussionBoardContent from "@/components/discussion_board_components/DiscussionBoardContent/DiscussionBoardContent";
import styles from "./DiscussionBoardPage.module.css";
import { LuPlus } from "react-icons/lu";

import { GetBoardsGroupByCourseByUserID } from "@/services/discussion_api/DiscussionBoardApi";
import { GetOverviewPostByBId } from "@/services/discussion_api/PostApi";

function DiscussionBoard() {
    const { state } = useLocation();
    const { param } = useParams();
    const [error, setError] = useState(null);
    const [courseBoardData, setCourseBoardData] = useState(null);
    const [overviewPostData, setOverviewPostData] = useState(null);
    let currentCourse;
    let currentBoard;
    useEffect(() => {
        const fetchCourseBoards = async () => {
            try {
                const userID = JSON.parse(localStorage.getItem("user")).user_id;
                const data = await GetBoardsGroupByCourseByUserID(userID);
                setCourseBoardData(data);
                setError(null);
            } catch (err) {
                setError("無法載入討論資料");
            }
        };
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

    if (!courseBoardData) {
        return (<p>載入中...</p>);
    }

    if (param != null && param !== "home") {
        if (!overviewPostData) {
            return (<p>載入中...</p>);
        }
        let currentBoardId = parseInt(param);
        for (let i = 0; i < courseBoardData.length; i++) {
            for (let j = 0; j < courseBoardData[i].boards.length; j++) {
                if (courseBoardData[i].boards[j].board_id == currentBoardId) {
                    const { course_id, course_name } = courseBoardData[i];
                    const { board_id, board_name } = courseBoardData[i].boards[j];
                    currentCourse = { course_id: course_id, course_name: course_name };
                    currentBoard = { board_id: board_id, board_name: board_name };
                }
            }
        }
    }

    if (error) return (<p className="text-red-500">{error}</p>);

    return (
        <>
            <LeftBar />
            <div className="flex">
                <BoardSideBar itemData={courseBoardData} />
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
                                    courseName={currentCourse.course_name}
                                    boardName={currentBoard.board_name}
                                />
                                <Link
                                    to="/post-edit/new"
                                    className={styles.fab}
                                    state={{ data: courseBoardData, currentCourseId: currentCourse.course_id, currentBoardId: currentBoard.board_id }}
                                    title="新增貼文"
                                >
                                    <LuPlus />
                                </Link>
                            </div>
                    }
                </div>
            </div>
        </>
    );
}

export default DiscussionBoard;