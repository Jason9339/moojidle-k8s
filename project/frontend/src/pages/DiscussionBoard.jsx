import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BoardSideBar from "@/components/discussion-board/BoardSideBar";
import { getCourseDiscussionBoardFake } from "@/services/UserApi/BoardAPI";
import PostPreview from "@/components/discussion-board/PostPreview";



function DiscussionBoard() {
    const { param } = useParams();
    console.log("目前 param：", param);
    const [posts, setPosts] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getCourseDiscussionBoardFake(param);
                //const courseData = await getCourse(param); 
                setPosts(data);
                //setCourseName(courseData.name || `課程 ${param}`);
                setError(null);
            } catch (err) {
                setError("無法載入討論資料");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [param]);

    return (
        <div style={{ display: "flex" }}>
            <BoardSideBar />
            <div style={{ padding: "20px", flex: 1 }}>
                <h2>課程{param}討論版</h2>
                {loading && <p>載入中...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && posts.length === 0 && <p>目前沒有貼文</p>}
                {posts.map((post) => (
                    <Link
                        key={post.post_id}
                        to={`/post/${post.post_id}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                            borderRadius: "8px",
                            transition: "box-shadow 0.2s, background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f9f9f9";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <PostPreview post={post} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DiscussionBoard;
