import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion_board_components/BoardSideBar";
import LeftBar from '@/components/LeftBar/LeftBar.jsx'
import DiscussionBoardInitContent from "@/components/discussion_board_components/DiscussionBoardInitContent/DiscussionBoardInitContent";
import DiscussionBoardContent from "@/components/discussion_board_components/DiscussionBoardContent/DiscussionBoardContent";
import { GetBoardsGroupByCourseByUserID } from "@/services/discussion_board_api/BoardApi";

// css styling
import styles from "./DiscussionBoardPage.module.css"

function DiscussionBoard() {
    const { param } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [boardData, setBoardData] = useState([]);
    const [currentBoardID, setCurrentBoardID] = useState(-1);
    const [postData, setPostData] = useState([])

    const setBoardIDAndFetchPosts = useCallback((board_id) => {
        setCurrentBoardID(board_id);

        // TODO Fetch post data by board_id

    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // TODO use Context to save userID
                const userID = JSON.parse(localStorage.getItem("user")).user_id;
                const data = await GetBoardsGroupByCourseByUserID(userID);
                console.log(data)
                setBoardData(data);
                setError(null);
                setLoading(false);
            } catch (err) {
                setError("無法載入討論資料");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return (<p>載入中...</p>)
    if (error) return (<p className="text-red-500">{error}</p>)
    return (
        <>

            <LeftBar />
            <div className="flex">
                <BoardSideBar itemData={boardData} setBoardID={setCurrentBoardID} />

                {/* <div className="p-5 flex-1 flex flex-col h-screen w-[180px]"> */}
                <div className={styles["main-content-flex-box"]}>
                    {
                        param == "home" || param == null ?
                            <DiscussionBoardInitContent />
                            :
                            <DiscussionBoardContent />
                    }
                </div>
            </div >

        </>
    );
}

export default DiscussionBoard;
