import React, { useState } from 'react';
import TextEditor from '@/components/text-editor/TextEditor';
import { BsZoomOut } from "react-icons/bs";
import TagLabel from '@/components/user/TagLabel';
const CreatePostButton = () => {

    // TODO integrate tag fetch.
    const tags = [{
        name: "吵架王", color: "red"
    },
    { name: "辯論高手", color: "blue" }];
    const [expand, setExpanded] = useState(false);

    return (
        <div onClick={() => { if (!expand) setExpanded(true) }}
            className={`relative flex flex-col p-5 w-full ${expand ? 'h-[75vh]' : 'h-[5vh]'} bg-[#7B7B7B] transition-[height] duration-300 ease-in-out overflow-hidden ${expand ? "cursor-default" : "cursor-pointer"} box-border`}
        >
            <div className='text-base text-left '> {expand ? ' ' : '建立貼文'}</div>

            <h3 className='ml-4'>Tag</h3>

            <div className='flex'>

                {tags.map((t) => {
                    <TagLabel text={t.name} color={t.color} />
                })}
            </div>
            <h3 className='ml-4'>主旨</h3>
            <textarea className="textfield p-4 border rounded-[3px] w-19/20 m-5 bg-[#D0D0D0]" />
            <h3 className='ml-4'>內文</h3>
            <TextEditor styles={{ margin: "20px", backgroundColor: "#D0D0D0" }} />

            {expand ? <button className='absolute bottom-2 right-2' onClick={() => setExpanded(true)}>{<BsZoomOut />}</button> : <></>}
        </div >

    )
}
export default CreatePostButton;
