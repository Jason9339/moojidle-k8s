import Button from "@/components/Button/Button"; import LeftBar from "@/components/LeftBar/LeftBar";
import Redirect from "@/components/Redirect/Redirect";
import TextEditor from "@/components/TextEditor/TextEditor";
import PostEditCustomTag from "@/components/post_components/PostEditCustomTag/PostEditCustomTag";
import PostEditDestSelector from "@/components/post_components/PostEditDestSelector/PostEditDestSelector";
import { CreatePost, EditPost, GetPostContent } from "@/services/PostApi";
import { GetAvatarUrl, GetUserDataById } from "@/services/UserApi";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import styles from "./PostEdit.module.css";
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

    // Destination 
    const [selectedCourse, setSelectedCourse] = useState(initialCourse);
    const [selectedBoard, setSelectedBoard] = useState(initialBoard);
    const [isDisabled, setIsDisabled] = useState(true);

    // User 
    const [imgSrc, setImgSrc] = useState("/user_pfp/default.png");
    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");

    // Post
    const [description, setDescription] = useState("");
    const [userTags, setUserTags] = useState([]);
    const [allUserTags, setAllUserTags] = useState([]);

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

        setSelectedCourse(state?.current?.course || null);
        setSelectedBoard(state?.current?.board || null);

        if (!state?.current?.course) {
            setIsDisabled(false);
        }
    }, [state])

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).user_id;
                const data = await GetUserDataById(userId);
                setUsername(data?.name);
                setAllUserTags(data?.user_tags.map((t) => t.user_tag));
                let isMounted = true;
                const userPfp = data?.path_to_profile_pic;
                const loadAvatar = async () => {
                    const avatarUrl = await GetAvatarUrl(userPfp);
                    if (isMounted) {
                        setImgSrc(avatarUrl);
                    }
                };

                if (userPfp) {
                    loadAvatar();
                } else {
                    setImgSrc("/user_pfp/default.png");
                }

                return () => {
                    isMounted = false;
                    // 清理 blob URL
                    if (imgSrc && imgSrc.startsWith('blob:')) {
                        URL.revokeObjectURL(imgSrc);
                    }
                };
            } catch {
                navigate("/login");
            }
        };

        fetchTag();

    }, [navigate]);

    useEffect(() => {
        const fetchPost = async () => {
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
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchPost();
    }, [post_id, refreshTrigger]);

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
                alert("請選擇討論版");
                return;
            }

            if (title.length === 0) {
                alert("請輸入貼文標題");
                return;
            }

            if (description.length === 0) {
                alert("請輸入貼文內容");
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
                alert("內容沒有變更。")
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
    console.log("tags:", allUserTags);

    return (
        <div className={styles.appLayout}>

            <LeftBar />
            <div className={styles.container}>
                <PostEditDestSelector
                    courseData={state.data}
                    selectedCourse={selectedCourse}
                    selectedBoard={selectedBoard}
                    onCourseChange={handleCourseChange}
                    onBoardChange={handleBoardChange}
                    isDisabled={isDisabled}
                />


                <div className={styles["user-profiles"]}>

                    <img
                        src={imgSrc}
                        onError={() => setImgSrc("/user_pfp/default.png")}
                        className={styles["user-pfp"]}
                        alt="profile"
                    />

                    <div className={styles["user-info"]}>

                        <span
                            className={styles["user-name"]}>

                            {username}
                        </span>
                        <PostEditCustomTag
                            className={styles["user-tags"]}
                            allUserTags={allUserTags}
                            onChange={(newSelectedTags) => setUserTags(newSelectedTags)}
                            postTags={userTags}
                        />

                    </div>
                </div>
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
                            variant="cancel"
                            onClick={handleCancel}
                        >
                            取消
                        </Button>
                        <Button
                            variant="confirm"
                            onClick={handleSubmit}
                        >
                            確認
                        </Button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default PostEdit;
