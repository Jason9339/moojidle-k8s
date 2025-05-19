import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";
import Redirect from "@/components/Redirect/Redirect";
import TextEditor from "@/components/TextEditor/TextEditor";
import PostEditCustomTag from "@/components/post_components/PostEditCustomTag";
import PostEditDestSelector from "@/components/post_components/PostEditDestSelector";
import { CreatePost } from "@/services/PostApi";
import { GetUserTagsById } from "@/services/UserApi";
import { useRef } from "react";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const PostEdit = () => {
    const { state } = useLocation();
    const initialCourse = state?.selectedCourse || null;
    const initialBoard = state?.selectedBoard || null;

    const [selectedCourse, setSelectedCourse] = useState(initialCourse);
    const [selectedBoard, setSelectedBoard] = useState(initialBoard);
    const { param } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [userTags, setUserTags] = useState([]);
    const allUserTags = useRef([]);
    const [error, setError] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();

    const handleCourseChange = useCallback(option => {
        setSelectedCourse(option);
        setSelectedBoard(null);
    }, []);

    const handleBoardChange = useCallback(option => {

        setSelectedBoard(option);
    }, []);
    /*  Effects */
    useEffect(() => {

        const fetchTag = async () => {
            try {

                // TODO use Context to save userID
                const userId = JSON.parse(localStorage.getItem("user")).user_id;
                const tags = await GetUserTagsById(userId);
                allUserTags.current = tags.map(t => t.user_tag);
                setSelectedCourse(state?.current.course || null);
                setSelectedBoard(state?.current.board || null);
            }

            catch (e) {
                setError("找不到User Id: ", e);
            }
        }

        fetchTag();

        if (!state.current?.course) {
            setIsDisabled(false);
        }
    }, [state])



    if (!state?.data) {

        return <Redirect />
    }



    // eslint-disable-next-line
    const handleTitleChange = useCallback((txt) => {
        txt = txt.replace(/[\r\n]+/g, '');
        setTitle(txt);
    }, [])

    // eslint-disable-next-line
    const handleDescriptionChange = useCallback((txt) => {
        setDescription(txt)
    }, [])
    // eslint-disable-next-line
    const handleCancel = useCallback(() => {
        navigate(-1);

    }, [navigate]);

    // eslint-disable-next-line
    const handleSubmit = useCallback(async () => {
        // TODO use Context to save userID
        const userId = JSON.parse(localStorage.getItem("user")).user_id;
        if (selectedBoard == null || selectedBoard == undefined) {
            alert("請選擇討論版");
            return;
        }

        if (title.length == 0) {
            alert("請輸入貼文標題");
            return;
        }


        if (description.length == 0) {
            alert("請輸入貼文內容");
            return;
        }
        const data = {
            post_by_user_id: userId,
            post_user_custom_tags: userTags,
            description: description,
            title: title,
            in_b_id: selectedBoard.value,

        }

        const resData = await CreatePost(data);

        const post = resData.post;

        navigate(`/discussion/${selectedBoard.value}`, {
            state: {
                newPostId: post.post_id
            }

        });
    }, [navigate, description, title, userTags, selectedBoard]);

    // check a course has a discusiion board
    for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].boards == [] || state.data[i].boards == undefined) {
            state.data.splice(i, 1);
        }
    }

    return (

        <>
            <LeftBar />

            <div className="flex flex-col w-[calc(100vw_-_180px)] px-[calc(100vw_-_180px-_80vw)] h-screen overflow-y-scroll bg-[#eff2f5]">
                <PostEditDestSelector courseData={state.data}
                    selectedCourse={selectedCourse}
                    selectedBoard={selectedBoard}
                    onCourseChange={handleCourseChange}
                    onBoardChange={handleBoardChange}
                    isDisabled={isDisabled}
                />

                <PostEditCustomTag allUserTags={allUserTags.current} onChange={(newSelectedTags) => setUserTags(newSelectedTags)} />
                <hr />

                <form className="" onSubmit={handleSubmit}>
                    <label htmlFor="titile">標題</label>
                    <textarea id="title" maxLength="20" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="輸入標題..." rows={1} wrap="off" className="w-full mt-[1vh] mb-[2vh] border p-4 rounded-2xl resize-none overflow-hidden bg-[#ffffff]" />

                    <label htmlFor="description" >內文</label>
                    <TextEditor className="mt-[1vh]" height="60vh" rows={19} onChange={txt => handleDescriptionChange(txt)} />

                    <div className="flex justify-end mt-[1vh]">
                        <Button className="mr-[1vw]" onClick={() => { handleCancel() }}> 取消</Button>

                        <Button onClick={handleSubmit}> 確認</Button>
                    </div>
                </form>

            </div>
        </>

    )



}

export default PostEdit;
