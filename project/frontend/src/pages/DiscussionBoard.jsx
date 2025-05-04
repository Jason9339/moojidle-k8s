import React from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion-board/BoardSideBar";
function DiscussionBoard() {
    const { param } = useParams();
    const isNumeric = /^\d+$/.test(param);

    return (
        <>
            <BoardSideBar />
            {param}
        </>
    );
}

export default DiscussionBoard;
