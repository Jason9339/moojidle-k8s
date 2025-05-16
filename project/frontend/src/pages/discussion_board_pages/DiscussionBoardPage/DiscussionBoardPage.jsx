import React, { useState, useEffect, useCallback } from "react";
import { data, useParams, Link, useLocation } from "react-router-dom";
import BoardSideBar from "@/components/discussion_board_components/BoardSideBar";
import LeftBar from '@/components/LeftBar/LeftBar.jsx'
import DiscussionBoardInitContent from "@/components/discussion_board_components/DiscussionBoardInitContent/DiscussionBoardInitContent";
import DiscussionBoardContent from "@/components/discussion_board_components/DiscussionBoardContent/DiscussionBoardContent";
// css styling
import styles from "./DiscussionBoardPage.module.css"

// services
import { GetBoardsGroupByCourseByUserID } from "@/services/discussion_board_api/BoardApi";
import { GetOverviewPostByBId } from "@/services/discussion_api/PostApi";

function DiscussionBoard() {
    const { state } = useLocation();

    // console.log("[BoardPage] state=", state);
    const { param } = useParams();
    const [error, setError] = useState(null);
    const [courseBoardData, setCourseBoardData] = useState(null);
    const [overviewPostData, setOverviewPostData] = useState(null);
    let currentCourse;
    let currentBoard;
    useEffect(() => {
        const fetchCourseBoards = async () => {
            try {
                // TODO use Context to save userID
                const userID = JSON.parse(localStorage.getItem("user")).user_id;
                const data = await GetBoardsGroupByCourseByUserID(userID);
                // console.error(data)
                setCourseBoardData(data);
                setError(null);
            } catch (err) {
                setError("無法載入討論資料");
            } finally {
            }
        };

        fetchCourseBoards();
    }, []);

    useEffect(() => {
        async function FetchOverviewPost() {
            // get data from services
            const result = await GetOverviewPostByBId(parseInt(param));

            // console.log(result)
            // Post user just created will show on top.
            if (state?.newPostId) {
                const index = result.findIndex(post => post.post_id == state.newPostId);
                const [newPost] = result.splice(index, 1);
                result.unshift(newPost);

            }
            setOverviewPostData(result);
        }

        if (param != null && param != "home") {
            FetchOverviewPost();
        }
    }, [param]);

    // board data is missing
    if (!courseBoardData) {
        return (<p>載入中...</p>);
    }

    // want to get over view posts
    if (param != null && param !== "home") {
        if (!overviewPostData) {  // over view posts are missing...
            return (<p>載入中...</p>);
        }

        // find course name and board name
        let currentBoardId = parseInt(param);

        // for each course
        for (let i = 0; i < courseBoardData.length; i++) {
            // for each board in that course
            for (let j = 0; j < courseBoardData[i].boards.length; j++) {
                if (courseBoardData[i].boards[j].board_id == currentBoardId) {
                    // find the correct path
                    const { course_id, course_name } = courseBoardData[i];
                    const { board_id, board_name } = courseBoardData[i].boards[j];

                    currentCourse = { course_id: course_id, course_name: course_name };
                    currentBoard = { board_id: board_id, board_name: board_name };

                    console.error(currentBoard, currentCourse);
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

                {/* <header className={styles["category"]}>
                    討論版
                </header>
                <hr /> */}

                {/* <div className="p-5 flex-1 flex flex-col h-screen w-[180px]"> */}
                <div className={styles["main-container"]}>
                    {
                        param == "home" || param == null ?
                            <DiscussionBoardInitContent />
                            :
                            <div className="flex">

                                <DiscussionBoardContent
                                    overviewPosts={overviewPostData}
                                    courseName={currentCourse.course_name}
                                    boardName={currentBoard.board_name}
                                />

                                <Link to="/post-edit/new" className="text-[2rem] p-[5px] mt-[2vh] h-[8vh] rounded-[10px] bg-[#E0E0E0] hover:shadow top:50px"
                                    state={{ data: courseBoardData, currentCourseId: currentCourse.course_id, currentBoardId: currentBoard.board_id }}>
                                    新增貼文
                                </Link>
                            </div>
                    }
                </div>
            </div >

        </>
    );
}

export default DiscussionBoard;
