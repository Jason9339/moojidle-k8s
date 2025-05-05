import React from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion-board/BoardSideBar";
import PostLayout from "@/components/discussion-board/PostConent";
function PostContent() {
    const { BoardId, PostId } = useParams();

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <BoardSideBar />
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                <PostLayout/>
            </div>
        </div>
    );
}

export default PostContent;
