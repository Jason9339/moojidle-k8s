import React, { useState } from "react";
import styled from "styled-components";
import { FiMoreVertical } from "react-icons/fi";
import { DeleteCommend } from "@/services/post_api/PostAPI";

function CommentSection({
    post,
    newComment,
    setNewComment,
    handleCommentSubmit,
    reflash,
    currentUserId
}) {
    return (
        <SectionContainer>
            <CommentTitle>留言：</CommentTitle>

            <CommentInputWrapper>
                <CommentTextarea
                    rows="3"
                    placeholder="寫下你的留言..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <CommentButton onClick={handleCommentSubmit}>送出留言</CommentButton>
            </CommentInputWrapper>

            {!post.comments || post.comments.length === 0 ? (
                <p>目前尚無留言。</p>
            ) : (
                post.comments.slice().reverse().map((comment) => (
                    <CommentCard
                        key={comment.comment_id}
                        comment={comment}
                        currentPostId={post.post_id}
                        currentUserId={currentUserId}
                        reflash={reflash}
                    />
                ))
            )}
        </SectionContainer>
    );
}

function CommentCard({ comment, currentPostId, currentUserId, reflash }) {
    const [showMenu, setShowMenu] = useState(false);

    const handleCommentDelete = async () => {
        const commenData = {
            post_id: currentPostId,
            user_id: currentUserId,
            comment_date: comment.comment_date,
            description: comment.description
        };
        try {
            await DeleteCommend(commenData);
            alert("留言刪除成功");
        } catch (err) {
            alert("留言刪除失敗：" + (err.message || "未知錯誤"));
        }
        setShowMenu(false);
        reflash();
    };

    return (
        <CommentCardWrapper>
            <CommentCardContainer>
                <MoreOptionsWrapper>
                    <MoreButton onClick={() => setShowMenu(!showMenu)}>
                        <FiMoreVertical size={20} />
                    </MoreButton>
                    {showMenu && (
                        <DropdownMenu>
                            {currentUserId === comment.comment_by_user_id && (
                                <DropdownItem onClick={handleCommentDelete}>
                                    刪除留言
                                </DropdownItem>
                            )}
                            <DropdownItem>檢舉</DropdownItem>
                        </DropdownMenu>
                    )}
                </MoreOptionsWrapper>

                <CommentInfo>
                    使用者 {comment.comment_by_user_name}（{comment.comment_user_custom_tag}）於{" "}
                    {new Date(comment.comment_date).toLocaleString()}：
                </CommentInfo>
                <CommentText>{comment.description}</CommentText>
            </CommentCardContainer>
        </CommentCardWrapper>
    );
}

export default CommentSection;

// styled-components

const SectionContainer = styled.div`
    border-top: 1px solid #ccc;
    padding-top: 16px;
`;

const CommentTitle = styled.h3`
    margin-bottom: 12px;
`;

const CommentInputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const CommentTextarea = styled.textarea`
    resize: none;
    font-size: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-bottom: 10px;
`;

const CommentButton = styled.button`
    align-self: flex-end;
    background-color: #2e3e6e;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #1f2a50;
    }
`;

const CommentCardWrapper = styled.div`
    position: relative;
`;

const CommentCardContainer = styled.div`
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 10px;
    position: relative;
`;

const MoreOptionsWrapper = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
`;

const MoreButton = styled.button`
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DropdownMenu = styled.ul`
    position: absolute;
    top: 28px;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    list-style: none;
    padding: 8px 0;
    margin: 0;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const DropdownItem = styled.li`
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const CommentInfo = styled.p`
    font-size: 13px;
    color: #888;
`;

const CommentText = styled.p`
    font-size: 15px;
    color: #333;
    margin-top: 4px;
`;
