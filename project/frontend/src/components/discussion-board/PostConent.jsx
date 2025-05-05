import { useEffect, useState } from "react";
import styled from "styled-components";
import { getPostContentFake} from "@/services/PostApi/PostAPI";

function DiscussionPostView({ postId }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostContentFake(postId);
                setPost(data[0]);
            } catch (err) {
                setError("載入貼文失敗：" + (err.message || "未知錯誤"));
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;

        // 這裡你可以改成實際送出 API
        console.log("送出留言：", newComment);
        setNewComment("");
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>找不到貼文</p>;

    return (
        <PostContainer>
            <PostHeader>
                <Title>{post.in_b_id} / {post.title}</Title>
                <Info>
                    發文者：{post.post_by_user_id} | 發文時間：
                    {new Date(post.post_date).toLocaleString()}
                </Info> 
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

                {post.comments.length === 0 ? (
                    <p>目前尚無留言。</p>
                ) : (
                    post.comments.map((comment) => (
                        <CommentCard key={comment.comment_id}>
                            <CommentInfo>
                                使用者 {comment.comment_by_user_id}（{comment.comment_user_custom_tag}） 於{" "}
                                {new Date(comment.comment_date).toLocaleString()}：
                            </CommentInfo>
                            <CommentText>{comment.description}</CommentText>
                        </CommentCard>
                    ))
                )}
            </CommentSection>
        </PostContainer>
    );
}

export default DiscussionPostView;


const PostContainer = styled.div`
    background-color: #f0f2f5;
    padding: 24px;
    border-radius: 10px;
    margin: 20px;
`;

const PostHeader = styled.div`
    margin-bottom: 16px;
`;

const Title = styled.h2`
    color: #2e3e6e;
    margin-bottom: 8px;
    font-size: 40px;

`;

const Info = styled.p`
    color: #666;
    font-size: 14px;
`;

const Description = styled.pre`
    font-size: 25px;
    margin-bottom: 24px;
`;

const CommentSection = styled.div`
    border-top: 1px solid #ccc;
    padding-top: 16px;
`;

const CommentTitle = styled.h3`
    margin-bottom: 12px;
`;

const CommentCard = styled.div`
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 10px;
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

