import React, { useState } from 'react';

const CreatePostButton = () => {

    const [expand, setExpanded] = useState(false);

    return (
        <div onClick={() => setExpanded(e => !e)}
            className={`w-full ${expand ? 'h-[5vh]' : 'h-[75vh]'} bg-[#f0f0f0] transition-[height] duration-300 ease-in-out overflow-hidden cursor-pointer box-border`}
        >
            <div className='text-sm text-left p-4'> {expand ? '建立貼文' : ' '}</div>
            <textarea className="textfield p-4 border rounded-[3px] w-19/20 m-5 bg-[#7B7B7B]" placeholder={expand ? '' : "主旨"} />
        </div >

    )
}
export default CreatePostButton;
