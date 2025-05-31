import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";
import Redirect from "@/components/Redirect/Redirect";
import TextEditor from "@/components/TextEditor/TextEditor";
import PostEditCustomTag from "@/components/post_components/PostEditCustomTag";
import PostEditDestSelector from "@/components/post_components/PostEditDestSelector";
import { CreatePost, EditPost } from "@/services/PostApi";
import { GetUserTagsById } from "@/services/UserApi";
import { useRef, useCallback, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const PostEdit2 = () => {
    const { state } = useLocation();
    const { param } = useParams();
    // state.data 為課程清單 (含每個課程的討論版)
    if (!state?.data) {
        return (
            <>
                <LeftBar />
                <div style={{ backgroundColor: "#eff2f5", flex: 1, width: "100%" }} />
                <Redirect />
            </>
        );
    }

    // 判斷是否為編輯模式：如果 state.current.post 存在則視為編輯貼文
    const isEditing = !!state?.current?.post;

    // 若為編輯模式就先取出先前的貼文資料，否則用預設值
    const [title, setTitle] = useState(isEditing ? state.current.post.title : "");
    const [description, setDescription] = useState(
        isEditing ? state.current.post.description : ""
    );
    const [userTags, setUserTags] = useState(
        isEditing ? state.current.post.post_user_custom_tags : []
    );

    // 若有傳入已選擇的課程（或討論版），就直接給初始值
    const initialCourse = state?.selectedCourse || (isEditing ? state.current.course : null);
    const initialBoard = state?.selectedBoard || (isEditing ? state.current.board : null);
    const [selectedCourse, setSelectedCourse] = useState(initialCourse);
    const [selectedBoard, setSelectedBoard] = useState(initialBoard);

    const allUserTags = useRef([]);
    const [error, setError] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();

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
                allUserTags.current = tags.map((t) => t.user_tag);

                // 若編輯模式的話，嘗試自動更新已選課程與討論板（確保狀態同步）
                if (isEditing) {
                    setSelectedCourse(state.current.course || null);
                    setSelectedBoard(state.current.board || null);
                }
            } catch (e) {
                setError("找不到 User Id：" + e);
            }
        };

        fetchTag();

        // 若非從 state.current 傳入 course，則編輯頁面仍需可以選擇課程
        if (!state?.current?.course) {
            setIsDisabled(false);
        }
    }, [state, isEditing]);

    const handleTitleChange = useCallback((txt) => {
        // 移除換行符號使標題單行
        txt = txt.replace(/[\r\n]+/g, "");
        setTitle(txt);
    }, []);

    const handleDescriptionChange = useCallback((txt) => {
        setDescription(txt);
    }, []);

    const handleCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleSubmit = useCallback(
        async (e) => {
            // 防止表單預設動作
            e.preventDefault();
            const userId = JSON.parse(localStorage.getItem("user")).user_id;

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

            try {
                let resData;
                if (isEditing) {
                    // 編輯模式，須取得原貼文 id
                    resData = await EditPost(state.current.post.post_id, data);
                } else {
                    // 新增模式
                    resData = await CreatePost(data);
                }
                const post = resData.post;
                navigate(`/discussion/${selectedBoard.value}`, {
                    state: {
                        newPostId: post.post_id,
                    },
                });
            } catch (error) {
                alert("操作失敗：" + error.message);
            }
        },
        [navigate, description, title, userTags, selectedBoard, isEditing, state]
    );

    // 移除 courses 中沒有討論版的課程（原來資料有包含這塊）
    for (let i = 0; i < state.data.length; i++) {
        if (!state.data[i].boards || state.data[i].boards.length === 0) {
            state.data.splice(i, 1);
            i--; // 注意：刪除後索引往前調整
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
                    allUserTags={allUserTags.current}
                    onChange={(newSelectedTags) => setUserTags(newSelectedTags)}
                />
                <hr />

                <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-1">
                            標題
                        </label>
                        <textarea
                            id="title"
                            maxLength="20"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="輸入貼文標題..."
                            rows={1}
                            wrap="off"
                            className="w-full border p-3 rounded-xl resize-none overflow-hidden bg-white text-base"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-1">
                            內文
                        </label>
                        <TextEditor className="mt-2" height="50vh" rows={19} onChange={handleDescriptionChange} />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button className="bg-gray-300 text-gray-800 hover:bg-gray-400" onClick={handleCancel}>
                            取消
                        </Button>
                        <Button className="bg-blue-600 text-white hover:bg-blue-700" type="submit">
                            確認
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostEdit2;