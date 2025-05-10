import React, { useState } from 'react';
import TextEditor from '@/components/text_editor/TextEditor';
import { BsZoomOut } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import TagLabel from '@/components/user/TagLabel';
const CreatePostButton = () => {


    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    // TODO integrate tag fetch.
    const fakeTags = [
        { id: 1, name: "吵架王", color: "red" },
        { id: 2, name: "辯論高手", color: "blue" }
    ]
    const [tags, setTags] = useState(fakeTags)


    /* TODO add user's existing tag*/
    const handleAddTag = () => {

    }

    const handleTitleChange = (txt) => {

        setTitle(txt)
    }

    const handleContentChange = (txt) => {
        setContent(txt)

        console.log("content")
    }

    const handleCancel = () => {
        setTitle("");
        setContent("");
        setTags([])
    }

    // TODO submit to backend
    const handeConfirm = () => {
        console.log(`title=${title}\n content=${content}\n tags=${tags}`)
    }
    const [expand, setExpanded] = useState(false);

    return (
        <div onClick={() => { if (!expand) setExpanded(true) }}
            className={`relative flex flex-col p-5 w-full ${expand ? 'h-[75vh]' : 'h-[5vh]'} bg-[#7B7B7B] transition-[height] duration-300 ease-in-out overflow-hidden ${expand ? "cursor-default" : "cursor-pointer"} box-border`}
        >
            <div className='text-base text-left '> {expand ? ' ' : '建立貼文'}</div>

            <h3 className='ml-4'>Tag</h3>

            <div className='flex pl-2.5'>

                {tags.map((t) => (
                    <TagLabel key={t.id} text={t.name} color={t.color} />
                ))}

                <button onClick={() => handleAddTag()}> <MdAddCircleOutline size={24} /></button>
            </div>
            <h3 className='ml-4'>主旨</h3>
            <textarea className="textfield p-4 border rounded-[3px] w-19/20 m-5 bg-[#D0D0D0]" onChange={(e) => handleTitleChange(e.target.value)} />
            <h3 className='ml-4'>內文</h3>
            <TextEditor styles={{ margin: "20px", backgroundColor: "#D0D0D0" }} onTextChange={(txt) => { handleContentChange(txt) }} />


            <div className='flex'>
                <button onClick={handleCancel}>取消</button>
                <button onClick={handeConfirm}>確認</button>
            </div>

            {expand ? <button className='absolute bottom-2 right-2' onClick={() => setExpanded(true)}>{<BsZoomOut size={30} />}</button> : <></>}
        </div >

    )
}
export default CreatePostButton;
