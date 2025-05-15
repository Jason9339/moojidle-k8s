import { useState } from "react";
import styled from "styled-components";
// import { LeaveCommend, DeletePost } from "@/services/post_api/PostAPI";
import { FiMoreVertical, FiCornerUpLeft } from "react-icons/fi"; 
import { useNavigate} from "react-router-dom";
import CommentCard from "@/components/post_components/CommentCard.jsx"

function DiscussionPostView({ post, reflash, handleCommentSubmit, handleDeletePost, newComment, setNewComment, currentUserId }) {

    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    return (
        <PostContainer>
            <PostHeader>
                <BackButton onClick={() => navigate(-1)}>
                    <FiCornerUpLeft size={24} />
                </BackButton>
                <HeaderTop>
                    <Title>
                        <CourseName>{post.course_name}</CourseName> / <BoardName>{post.board_name}</BoardName>
                    </Title>
                    <MoreOptionsWrapper>
                        <MoreButton onClick={() => setShowMenu(!showMenu)}>
                            <FiMoreVertical size={30} />
                        </MoreButton>
                        {showMenu && (
                            <DropdownMenu>
                                {currentUserId === post.post_by_user_id && (
                                    <DropdownItem onClick={handleDeletePost}>刪除貼文</DropdownItem>
                                )}
                                <DropdownItem>檢舉</DropdownItem>
                            </DropdownMenu>
                        )}
                    </MoreOptionsWrapper>
                </HeaderTop>
                
                <Info>
                    發文者：{post.author_name} | 發文時間：
                    {new Date(post.post_date).toLocaleString()}
                </Info>

                <Title>
                    <PostTitleText>{post.title}</PostTitleText>
                </Title>  
            </PostHeader>

            <Description>{post.description}</Description>

            <CommentSection>
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
            </CommentSection>
        </PostContainer>
    );
}

export default DiscussionPostView;



// styled-components

const PostContainer = styled.div`
    background-color: #f0f2f5;
    padding: 24px;
    border-radius: 10px;
    margin: 20px;
`;


const PostHeader = styled.div`
    margin-bottom: 16px;
`;

const HeaderTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BackButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2e3e6e;

    &:hover {
        color: #1f2a50;
    }
`;

const MoreOptionsWrapper = styled.div`
    position: relative;
`;

const MoreButton = styled.button`
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
`;

const DropdownMenu = styled.ul`
    position: absolute;
    top: 30px;
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


const Title = styled.h2`
    margin-bottom: 8px;
    font-size: 40px;
`;

const BoardName= styled.span`
    color: #2e3e6e;
`;

const CourseName = styled.span`
    color: red;
`;

const PostTitleText = styled.span`
    color: black;
`;

const Info = styled.p`
    color: #666;
    font-size: 20px;
`;

const Description = styled.pre`
    font-size: 25px;
    margin-bottom: 24px;
    white-space: pre-wrap;
`;

const CommentSection = styled.div`
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

const CommentMoreOptionsWrapper = styled.div`
    position: absolute;
    top: 8px;
    left: 8px;
`;

const CommentDropdownMenu = styled.ul`
    position: absolute;
    top: 30px;
    left: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    list-style: none;
    padding: 8px 0;
    margin: 0;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const CommentDropdownItem = styled.li`
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const CommentCardWrapper = styled.div`
    position: relative;
`;



