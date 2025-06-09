import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";
import Redirect from "@/components/Redirect/Redirect";
import TextEditor from "@/components/TextEditor/TextEditor";
import PostEditCustomTag from "@/components/post_components/PostEditCustomTag/PostEditCustomTag";
import PostEditDestSelector from "@/components/post_components/PostEditDestSelector";
import { CreatePost, EditPost, GetPostContent } from "@/services/PostApi";
import { GetUserTagsById } from "@/services/UserApi";
import { addAlert } from "@/utils/alert/AlertContext";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
};

const PostEdit = () => {
    const { post_id } = useParams();
    const { state } = useLocation();
    const initialCourse = state?.selectedCourse || null;
    const initialBoard = state?.selectedBoard || null;
    const [post, setPost] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(initialCourse);
    const [selectedBoard, setSelectedBoard] = useState(initialBoard);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [userTags, setUserTags] = useState([]);
    const [allUserTags, setAllUserTags] = useState([]);
    const [error, setError] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();
    const isModified = title !== post?.title ||
        description !== post?.description ||
        !arraysEqual(userTags, post?.post_user_custom_tags?.map(tag => tag.tag_name) || []);
    const handleCourseChange = useCallback((option) => {
        setSelectedCourse(option);
        setSelectedBoard(null);
    }, []);

    
    const handleBoardChange = useCallback((option) => {
        setSelectedBoard(option);
    }, []);

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).user_id;
                const tags = await GetUserTagsById(userId);
                setAllUserTags(tags.map((t) => t.user_tag));
                setSelectedCourse(state?.current?.course || null);
                setSelectedBoard(state?.current?.board || null);
            } catch (e) {
                setError("找不到User Id: ", e);
            }
        };

        fetchTag();

        if (!state?.current?.course) {
            setIsDisabled(false);
        }
    }, [state]);

    useEffect(() => {
        const fetchPost = async () => {
            console.log("post_id", post_id);
            if (post_id !== "new") {
                try {
                    const data = await GetPostContent(post_id);
                    setPost(data);
                    setTitle(data.title);
                    setDescription(data.description);
                    if (data.post_user_custom_tags) {
                        const initialTags = data.post_user_custom_tags.map(tag => tag.tag_name);
                        setUserTags(initialTags);
                    }
                    // console.log("Edit");
                } catch (err) {
                    setError("載入貼文失敗：" + (err.message || "未知錯誤"));
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPost();
    }, [post_id, refreshTrigger]);

    const handleTagsChange = (newTags) => {
        setUserTags(newTags);
    };

    const handleTitleChange = useCallback((txt) => {
        txt = txt.replace(/[\r\n]+/g, "");
        setTitle(txt);
    }, []);

    const handleDescriptionChange = useCallback((txt) => {
        setDescription(txt);
    }, []);

    const handleCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleSubmit = useCallback(async () => {
        const userId = JSON.parse(localStorage.getItem("user")).user_id;

        if (post_id === "new") {
            if (!selectedBoard) {
                addAlert("請選擇討論版", "error");
                return;
            }

            if (title.length === 0) {
                addAlert("請輸入貼文標題", "error");
                return;
            }

            if (description.length === 0) {
                addAlert("請輸入貼文內容", "error");
                return;
            }

            const data = {
                post_by_user_id: userId,
                post_user_custom_tags: userTags,
                description,
                title,
                in_b_id: selectedBoard.value,
            };

            const resData = await CreatePost(data);
            const post = resData.post;

            navigate(`/discussion/${selectedBoard.value}`, {
                state: {
                    newPostId: post.post_id,
                },
            });
        } else {
            if (!isModified) {
                addAlert("內容沒有變更", "info")
                return
            }
            const data = {
                post_by_user_id: userId,
                post_user_custom_tags: userTags.map(tag => ({ tag_name: tag })), // 轉換格式
                description,
                title,
                in_b_id: selectedBoard.value,
                post_id: post_id,
            };

            await EditPost(post_id, data);

            navigate(`/post/${post_id}`);
        }
    }, [navigate, description, title, userTags, selectedBoard, isModified, post_id]);

    if (!state?.data) {
        return (
            <>
                <LeftBar />
                <div style={{ backgroundColor: "#eff2f5", flex: 1, width: "100%" }} />
                <Redirect />
            </>
        );
    }


    // 移除沒有討論版的課程
    for (let i = 0; i < state.data.length; i++) {
        if (!state.data[i].boards || state.data[i].boards.length === 0) {
            state.data.splice(i, 1);
        }
    }

    return (
        <div className="flex">
            <LeftBar />
            <div className="flex flex-col w-[calc(100vw_-_180px)] px-[calc(100vw_-_180px-_80vw)] h-screen bg-[#eff2f5]">
                <PostEditDestSelector
                    courseData={state.data}
                    selectedCourse={selectedCourse}
                    selectedBoard={selectedBoard}
                    onCourseChange={handleCourseChange}
                    onBoardChange={handleBoardChange}
                    isDisabled={isDisabled}
                />

                <PostEditCustomTag
                    allUserTags={allUserTags}
                    onChange={(newSelectedTags) => setUserTags(newSelectedTags)}
                    postTags={userTags}
                />
                <hr />

                <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-lg font-semibold text-gray-700 mb-1"
                        >
                            標題
                        </label>
                        <textarea
                            id="title"
                            maxLength="20"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder={post?.title}
                            rows={1}
                            wrap="off"
                            className="w-full border p-3 rounded-xl resize-none overflow-hidden bg-white text-base"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-lg font-semibold text-gray-700 mb-1"
                        >
                            內文
                        </label>
                        <TextEditor
                            className="mt-2"
                            height="50vh"
                            value={description}
                            rows={19}
                            onChange={handleDescriptionChange}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                            onClick={handleCancel}
                        >
                            取消
                        </Button>
                        <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleSubmit}
                        >
                            確認
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostEdit;
