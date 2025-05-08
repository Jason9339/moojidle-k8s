import React from "react";
import { useParams } from "react-router-dom";
import LeftBar from '@/components/LeftBar/LeftBar.jsx'

function DiscussionBoard(){

    const {id} = useParams();

    return (
        <>
            <LeftBar></LeftBar>
            {id}
        </>

    )
}

export default DiscussionBoard;