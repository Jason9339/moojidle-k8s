import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";
import Redirect from "@/components/Redirect/Redirect";
import TextEditor from "@/components/TextEditor/TextEditor";
import { useCallback } from "react";
import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const PostEdit = () => {
    const { state } = useLocation();
    const { param } = useParams();
    const [title, setTitle] = useState("");

    console.log(state);
    const navigate = useNavigate();

    const handleCancel = useCallback(() => {
        console.log("cancel")
        navigate(-1);

    }, [navigate]);

    const handleSubmit = useCallback(() => {

        console.log("submit")

        navigate(-1, {

        });
    }, [navigate]);

    if (!state?.boardName || !state?.courseName) {

        return <Redirect />
    }


    return (

        <>
            <LeftBar />

            {param == "new" ? "new" : "edit"}
            <div className="flex flex-col px-[10vw] py-[5vh]">

                <div className="flex w-[70vw] h-[5vh] p-[5px]">
                    <span > {state.courseName} </span>
                    <span> {state.boardName} </span>
                </div>

                <div className="flex w-[70vw] h-[5vh] p-[5px]">
                    tags
                </div>
                <hr />

                <form className="p-[10px]" onSubmit={handleSubmit}>
                    <label htmlFor="titile">標題</label>
                    <textarea id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="輸入標題..." rows={1} wrap="off" className="w-full mt-[1vh] mb-[2vh] border p-2 rounded-2xl" />

                    <label htmlFor="description" >內文</label>
                    <TextEditor className="mt-[1vh] h-[60vh]" rows={19} />


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
