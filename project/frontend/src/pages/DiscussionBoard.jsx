import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BoardSideBar from "@/components/discussion_board/BoardSideBar";
import PostPreview from "@/components/discussion_board/PostPreview";
import PostCreator from "@/components/discussion_board/PostCreator";
import LeftBar from '@/components/LeftBar/LeftBar.jsx'


function DiscussionBoard() {
    const { param } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // const data = await getCourseDiscussionBoardFake(param);
                //const courseData = await getCourse(param); 
                // setPosts(data);
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
        <>

            <LeftBar />
            <div className="flex">
                <BoardSideBar />

                <div className="p-5 flex-1 flex flex-col h-screen w-[35vw]">
                    {
                        param == "home" ?
                            <span>
                                Homepage
                            </span>

                            :

                            <>                            <PostCreator />
                                <h2>課程{param}討論版</h2>
                                {loading && <p>載入中...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {!loading && posts.length === 0 && <p>目前沒有貼文</p>}
                                {posts.map((post) => (

                                    <PostPreview post={post} />
                                ))}
                            </>

                    }

                </div>
            </div >

            <div className="flex flex-col w-10vw h-screen">
                <button className="w-full text-center" onClick={() => { alert("new post") }}>
                    新增貼文
                </button>
            </div>
        </>

    );
}

export default DiscussionBoard;
