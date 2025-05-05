import React from "react";
import { useParams } from "react-router-dom";

function DiscussionBoard(){

    const {id} = useParams();

    return (
        <>
            {id}
        </>

    )
}

export default DiscussionBoard;