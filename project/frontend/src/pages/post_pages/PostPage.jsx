import React, { useEffect, useState } from "react";
import styles from "./PostPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { FiCornerUpLeft } from "react-icons/fi";

import LeftBar from "@/components/LeftBar/LeftBar";
import CommentSection from "@/components/discussion_board_components/post_components/CommentSection.jsx";
import PostContent from "@/components/discussion_board_components/post_components/PostContent.jsx";
import { GetPostContent, LeaveCommend, DeletePost } from "@/services/post_api/PostAPI";

function PostPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser).user_id : null;
    const navigate = useNavigate();

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
        };
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
            alert("貼文刪除成功");
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
                <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                    <div className={styles.postContainer}>
                        <button className={styles.backButton} onClick={() => navigate(-1)}>
                            <FiCornerUpLeft size={24} />
                        </button>

                        <PostContent
                            post={post}
                            currentUserId={currentUserId}
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            handleDeletePost={handleDeletePost}
                        />

                        <CommentSection
                            post={post}
                            newComment={newComment}
                            setNewComment={setNewComment}
                            handleCommentSubmit={handleCommentSubmit}
                            reflash={reflash}
                            currentUserId={currentUserId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostPage;
