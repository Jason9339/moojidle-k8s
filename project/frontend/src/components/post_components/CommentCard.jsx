import React, { useState } from "react";
import styled from "styled-components";
import { FiMoreVertical } from "react-icons/fi";
import { DeleteCommend } from "@/services/post_api/PostAPI";

function CommentCard({ comment, currentPostId, currentUserId, reflash}) {
    const [showMenu, setShowMenu] = useState(false);
    const handleCommentDelete = async () => {
        const commenData = {
            post_id: currentPostId,
            user_id: currentUserId,
            comment_date: comment.comment_date,
            description: comment.description
        }
        try {
            await DeleteCommend(commenData);
        } catch (err) {
            alert("留言刪除失敗：" + (err.message || "未知錯誤"));
        }
        alert("留言刪除成功");
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
                                <DropdownItem onClick={() => {
                                    handleCommentDelete();
                                }}>
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

export default CommentCard;

// styled-components

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
