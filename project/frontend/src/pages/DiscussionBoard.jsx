import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion-board/BoardSideBar";
import { getCourseDiscussionBoardFake } from "@/services/UserApi/BoardAPI";

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
                    <div
                        key={post.post_id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "12px"
                        }}
                    >
                        <h3>{post.title}</h3>
                        <p><strong>發文者：</strong>{post.post_by_user_id}</p>
                        <p><strong>時間：</strong>{new Date(post.post_date).toLocaleString()}</p>
                        <p>{post.description}</p>
                        <p><strong>留言數：</strong>{post.comments?.length ?? 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DiscussionBoard;
