import React, { useEffect, useRef, useState } from "react";
import styles from "./PostPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

import LeftBar from "@/components/LeftBar/LeftBar";
import CommentSection from "@/components/post_components/CommentSection/CommentSection.jsx";
import PostContent from "@/components/post_components/PostContent/PostContent.jsx";
import {
    GetPostContent,
    LeaveCommend,
    DeletePost,
    DeleteCommend,
} from "@/services/PostApi";

function PostPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const courseData = JSON.parse(localStorage.getItem("courseData")) || [];


    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser).user_id : null;
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const textareaRef = useRef(null);
    const [description, setDescription] = useState("");

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

    useEffect(() => {
        if (post) {
            setDescription(post.description || "");
        }
    }, [post]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [description]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        const commenData = {
            post_id: post.post_id,
            user_id: currentUserId,
            custom_tag: "訪客",
            description: newComment,
        };
        try {
            await LeaveCommend(commenData);
            setNewComment("");
            reflash();
        } catch (err) {
            addAlert("留言送出失敗：" + (err.message || "未知錯誤"));
        }
    };

    const handleCommentDelete = async (comment) => {
        const commenData = {
            post_id: post.post_id,
            user_id: currentUserId,
            comment_date: comment.comment_date,
            description: comment.description,
        };
        try {
            await DeleteCommend(commenData);
            addAlert("留言刪除成功");
            reflash();
        } catch (err) {
            addAlert("留言刪除失敗：" + (err.message || "未知錯誤"));
        }
        setActiveCommentId(null);
        reflash();
    };

    const handleDeletePost = async () => {
        try {
            await DeletePost(post.post_id);
            addAlert("貼文刪除成功");
            navigate(`/discussion/${post.in_b_id}`);
        } catch (err) {
            addAlert("貼文刪除失敗：" + (err.message || "未知錯誤"));
        }
    };



    const reflash = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveCommentId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <LeftBar />
            {loading ? (
                <div
                    className={styles.pageWrapper}
                    style={{ backgroundColor: "#eff2f5" }}
                />
            ) : error ? (
                <div className={styles.pageWrapper}>
                    <p>{error}</p>
                </div>
            ) : !post ? (
                <div className={styles.pageWrapper}>
                    <p>找不到貼文</p>
                </div>
            ) : (
                <div className={styles.pageWrapper}>
                    <div className={styles.postContainer} ref={menuRef}>
                        <button className={styles.backButton} onClick={() => navigate(`/discussion/${post.in_b_id}`)}>
                            <FiChevronLeft size={24} />
                            返回
                        </button>

                        <div className={styles.contentWrapper}>
                            <PostContent
                                post={post}
                                currentUserId={currentUserId}
                                showMenu={showMenu}
                                setShowMenu={setShowMenu}
                                handleDeletePost={handleDeletePost}
                                description={description}
                                textareaRef={textareaRef}
                                editLinkState={{
                                    data: courseData,
                                    current: {
                                        post,
                                        course: {
                                            value: post.course_id,
                                            label: post.course_name,
                                        },
                                        board: {
                                            value: post.board_id,
                                            label: post.board_name,
                                        },
                                    },
                                }}
                            />

                            <CommentSection
                                post={post}
                                newComment={newComment}
                                setNewComment={setNewComment}
                                handleCommentSubmit={handleCommentSubmit}
                                currentUserId={currentUserId}
                                handleCommentDelete={handleCommentDelete}
                                activeCommentId={activeCommentId}
                                setActiveCommentId={setActiveCommentId}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PostPage;
