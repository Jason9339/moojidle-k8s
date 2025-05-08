import React from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion-board/BoardSideBar";
import PostContent from "@/components/discussion-board/PostConent";
import LeftBar from "@/components/LeftBar/LeftBar";


function Post() {
    const { id } = useParams();
    return (
        <>
            <LeftBar />

            <div style={{ display: "flex", height: "100vh" }}>
                <BoardSideBar />
                <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                    <PostContent postId={id} />
                </div>
            </div>

        </>
    );
}

export default Post;
