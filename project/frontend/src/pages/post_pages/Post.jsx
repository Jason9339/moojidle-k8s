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
    const [newComment, setNewComment] = useState("");

    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser).user_id : null;
    
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

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        const commenData = {
            post_id: post.post_id,
            user_id: currentUserId,
            custom_tag: "訪客",
            description: newComment
        }
        try {
            await LeaveCommend(commenData);
            setNewComment("");
            reflash();
        } catch (err) {
            alert("留言送出失敗：" + (err.message || "未知錯誤"));
        }
    };

    const handleDeletePost = async () => {
        try {
            await DeletePost(post.in_b_id);
            navigate(`/discussion/${post.in_b_id}`);
    
        } catch (err) {
            alert("貼文刪除失敗：" + (err.message || "未知錯誤"));
        }
    };

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
                        reflash={reflash}
                        handleCommentSubmit={handleCommentSubmit}
                        handleDeletePost={handleDeletePost}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        currentUserId={currentUserId} />
                </div>
            </div>

        </>
    );
}

export default Post;
