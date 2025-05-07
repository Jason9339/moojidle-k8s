import { useEffect, useState } from "react";
import styled from "styled-components";
import { getPostContent, getUserName, getBoardName } from "@/services/PostApi/PostAPI";

function PostContent(props) {
    const [post, setPost] = useState(null);
    const [postAuthorName, setPostAuthorName] = useState("");
    const [boardName, setBoardName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");

    const postId = props.postId;
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostContent(postId);

                // 發文者名稱
                const postAuthor = await getUserName(data.post_by_user_id);
                setPostAuthorName(postAuthor.name);

                const postBoard = await getBoardName(data.in_b_id);
                setBoardName(postBoard.name);

                // 留言者名稱
                const commentsWithNames = await Promise.all(
                    (data.comments || []).map(async (comment) => {
                        const userData = await getUserName(comment.comment_by_user_id);
                        return {
                            ...comment,
                            comment_user_display_name: userData.name,
                        };
                    })
                );

                setPost({ ...data, comments: commentsWithNames });
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

        const newCommentObj = {
            comment_id: Date.now(),
            comment_by_user_id: 999,
            comment_user_custom_tag: "訪客",
            comment_user_display_name: "User999",
            comment_date: new Date().toISOString(),
            description: newComment,
        };

        setPost((prev) => ({
            ...prev,
            comments: [...(prev.comments || []), newCommentObj],
        }));

        setNewComment("");
    };

    const formatDate = (dateObj) => {
        const date = new Date(dateObj?.$date || dateObj);
        return isNaN(date) ? "無效日期" : date.toLocaleString();
    };

    if (loading) return <p>⏳ 載入中...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>找不到貼文</p>;

    return (
        <PostContainer>
            <PostHeader>
                <Title>{boardName} / {post.title}</Title>
                <Info>
                    發文者：{postAuthorName}（{post.post_by_user_id}） | 發文時間：{formatDate(post.post_date)}
                </Info>
            </PostHeader>

            <Description>{post.description}</Description>

            <TagList>
                {post.post_tags && post.post_tags.length > 0 ? (
                    post.post_tags.map((tag) => (
                        <Tag key={tag.tag_id}>{tag.tag_name}</Tag>
                    ))
                ) : (
                    <Tag>(無標籤)</Tag>
                )}
            </TagList>

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
                    post.comments.map((comment) => (
                        <CommentCard key={comment.comment_id}>
                            <CommentInfo>
                                使用者 {comment.comment_user_display_name}（{comment.comment_user_custom_tag}）於{" "}
                                {formatDate(comment.comment_date)}：
                            </CommentInfo>
                            <CommentText>{comment.description}</CommentText>
                        </CommentCard>
                    ))
                )}
            </CommentSection>
        </PostContainer>
    );
}

export default PostContent;


// ======================= styled-components =======================

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
    margin-bottom: 16px;
`;

const TagList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
`;

const Tag = styled.span`
    background-color: #e0e7ff;
    color: #1e3a8a;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 13px;
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
