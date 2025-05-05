import React from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion-board/BoardSideBar";
import DiscussionPostView from "@/components/discussion-board/PostConent";


function PostContent() {
    const { param } = useParams();

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <BoardSideBar />
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                <DiscussionPostView postId = {param} />
            </div>
        </div>
    );
}

export default PostContent;
