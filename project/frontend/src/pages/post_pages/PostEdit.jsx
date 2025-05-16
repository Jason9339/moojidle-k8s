import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";
import Redirect from "@/components/Redirect/Redirect";
import TextEditor from "@/components/TextEditor/TextEditor";
import PostEditHeader from "@/components/post_components/PostEditHeader";
import { CreatePost } from "@/services/discussion_api/PostApi";
import { GetUserTagsById } from "@/services/user_api/UserApi";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";


const NOT_EXIST = -1;
const PostEdit = () => {
    const { state } = useLocation();
    const { param } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [userTags, setUserTags] = useState([]);
    const [boardData, setBoardData] = useState([]);
    const [courseData, setCourseData] = useState([])
    const [error, setError] = useState(null);
    const [enable, setEnable] = useState(false);
    const navigate = useNavigate();


    const setCurrentCourseById = useCallback((courseId) => {
        const obj = state.data.find((d) => d.course_id == courseId);

        const data = obj.boards.map(
            (b) => ({ value: b.board_id, label: b.board_name })
        );
        setBoardData(data);
        const { boards, ...curr } = obj;
        state.currentCourse = curr;
        state.currentBoardId = boards[0].board_id ?? NOT_EXIST;
    }, [state]);

    const setCurrentBoardById = useCallback((boardId) => {

        state.currentBoardId = boardId;
    }, [state])


    if (!state?.data) {

        return <Redirect />
    }


    // eslint-disable-next-line
    useEffect(() => {

        const fetchTag = async () => {
            try {

                // TODO use Context to save userID
                const userId = JSON.parse(localStorage.getItem("user")).user_id;
                const tags = await GetUserTagsById(userId);
                setUserTags(tags.map(t => t.user_tag));


                setEnable(!state.hasOwnProperty("currentCourseId"));


            }

            catch (e) {
                setError("找不到User Id: ", e);
            }
        }

        fetchTag();

    }, [])

    // eslint-disable-next-line
    useEffect(() => {


        const courses = state.data.map((d) => (
            { value: d.course_id, label: d.course_name }
        ));
        setCourseData(courses);

        if (state.hasOwnProperty("currentCourseId")) {

            setCurrentCourseById(state.currentCourseId);
        }


    }, [state.data, state.currentCourseId,
        setCurrentCourseById])

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

        const data = {
            post_by_user_id: userId,
            post_user_custom_tags: userTags,
            description: description,
            title: title,
            in_b_id: state.currentBoardId,

        }


        const resData = await CreatePost(data);

        const post = resData.post;

        navigate(`/discussion/${state.currentBoardId}`, {
            state: {
                newPostId: post.post_id
            }

        });
    }, [navigate, description, state.currentBoardId, title, userTags]);


    return (

        <>
            <LeftBar />

            <div className="flex flex-col w-[calc(100vw_-_180px)] px-[calc(100vw_-_180px-_80vw)] py-[1vh] h-screen overflow-scroll-y">
                <PostEditHeader courseData={courseData} boardData={boardData}
                    defaultCourseId={state.currentCourseId} defaultBoardId={state.currentBoardId} userTags={userTags}
                    onCourseFilterChange={(e) => setCurrentCourseById(e)}
                    onBoardFilterChange={(e) => setCurrentBoardById(e)}
                    enable={enable}
                />
                <hr />

                <form className="p-[10px]" onSubmit={handleSubmit}>
                    <label htmlFor="titile">標題</label>
                    <textarea id="title" maxLength="20" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="輸入標題..." rows={1} wrap="off" className="w-full mt-[1vh] mb-[2vh] border p-4 rounded-2xl resize-none overflow-hidden" />

                    <label htmlFor="description" >內文</label>
                    <TextEditor className="mt-[1vh]" height="60vh" rows={19} onChange={txt => handleDescriptionChange(txt)} />

                    <div className="flex justify-end mt-[1vh]">
                        <Button className="mr-[1vw]" onClick={() => { handleCancel() }}> 取消</Button>

                        <Button onClick={() => { handleSubmit() }}> 確認</Button>
                    </div>
                </form>

            </div>
        </>

    )



}

export default PostEdit;
