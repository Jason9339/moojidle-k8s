import React from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion-board/BoardSideBar";
import PostContent from "@/components/discussion-board/PostConent"; "@/components/discussion-board/PostConent";


function Post() {
    const { id } = useParams();
    console.log("id=", id);
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <BoardSideBar />
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                <PostContent postId={id} />
            </div>
        </div>
    );
}

export default Post;
