import React, { useState, useEffect, useCallback } from "react";
import { data, useParams } from "react-router-dom";
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
    const { param } = useParams();
    const [error, setError] = useState(null);
    const [courseBoardData, setCourseBoardData] = useState(null);
    const [overviewPostData, setOverviewPostData] = useState(null);

    let currentCourseName;
    let currentBoardName;

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
        if(!overviewPostData){  // over view posts are missing...
            return (<p>載入中...</p>);
        }

        // find course name and board name
        let currentBoardId = parseInt(param);

        // for each course
        for(let i = 0; i < courseBoardData.length; i ++){
            // for each board in that course
            for(let j = 0; j < courseBoardData[i].boards.length; j ++){
                if(courseBoardData[i].boards[j].board_id == currentBoardId){
                    // find the correct path
                    currentCourseName = courseBoardData[i].course_name;
                    currentBoardName = courseBoardData[i].boards[j].board_name;
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

                {/* <div className="p-5 flex-1 flex flex-col h-screen w-[180px]"> */}
                <div className={styles["main-content-flex-box"]}>
                    {
                        param == "home" || param == null ?
                            <DiscussionBoardInitContent />
                            :
                            <DiscussionBoardContent 
                                overviewPosts={overviewPostData}
                                courseName={currentCourseName}
                                boardName={currentBoardName}
                            />
                    }
                </div>
            </div >

        </>
    );
}

export default DiscussionBoard;
