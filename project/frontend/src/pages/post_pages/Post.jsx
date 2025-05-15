import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPostContent, LeaveCommend, DeletePost } from "@/services/post_api/PostAPI";
import DiscussionPostView from "@/components/post_components/PostConent.jsx";
import LeftBar from "@/components/LeftBar/LeftBar";


function Post() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await GetPostContent(id);
                setPost(data);
            } catch (err) {
                setError("載入貼文失敗：" + (err.message || "未知錯誤"));
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, refreshTrigger]); 

    const reflash = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>找不到貼文</p>;

    return (
        <>
            <LeftBar />

            <div style={{ display: "flex", height: "100vh" }}>
                {/* <BoardSideBar /> */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                    <DiscussionPostView 
                        post={post}
                        reflash={reflash} />
                </div>
            </div>

        </>
    );
}

export default Post;
