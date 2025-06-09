import React, { useState } from 'react';
import OverviewPostCard from '@/components/discussion_board_components/OverviewPostCard/OverviewPostCard';
import { useNavigate } from "react-router-dom";


// style
import styles from "./DiscussionBoardContent.module.css"

const DiscussionBoardContent = ({ overviewPosts, courseName, boardName }) => {
    // the below is what each overviesPost looks like
    // 
    // {
    //     "_id": "682330dbf6a55c606bd86285",
    //     "post_id": 1,
    //     "post_by_user_id": 4,
    //     "title": "Post title 1 in Board 1",
    //     "post_user_custom_tags": [
    //         {
    //             "tag_name": "User4's CustomTag_1"
    //         }
    //     ],
    //     "description": "This is the content of post 1 ....",
    //     "post_date": "2025-01-15T00:00:00.000Z",
    //     "public": true,
    //     "in_b_id": 1,
    //     "post_tags": [
    //         {
    //             "tag_name": "Tag_68"
    //         },
    //         {
    //             "tag_name": "Tag_15"
    //         }
    //     ],
    //     "post_by_user_name": "User 4",
    //     "post_by_user_pfp": "/profiles/4.jpg"
    // }
    const navigate = useNavigate();

    const handleCardClick = (overviewPost) => {
        // console.log("Card clicked:", overviewPost);
        navigate(`/post/${overviewPost.post_id}`);

    };


    return (
        <>
            <div className={styles["content-flex-box"]}>
                {/* foreach overviewPost in overviewPosts */}
                {overviewPosts && overviewPosts.length > 0 ? (
                    overviewPosts.slice().reverse().map((overviewPost, index) => (
                        <OverviewPostCard
                            key={overviewPost.post_id}
                            userPfp={overviewPost.post_by_user_pfp}
                            courseName={courseName}
                            boardName={boardName}
                            userName={overviewPost.post_by_user_name}
                            userTags={overviewPost.post_user_custom_tags}
                            title={overviewPost.title}
                            content={overviewPost.description}
                            postDate={overviewPost.post_date}
                            onClick={() => handleCardClick(overviewPost)}
                        />
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
        </>
    )
}

export default DiscussionBoardContent;
