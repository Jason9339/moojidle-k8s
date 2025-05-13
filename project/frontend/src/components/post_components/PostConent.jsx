import { useEffect, useState } from "react";
import styled from "styled-components";
import { GetPostContent } from "@/services/post_api/PostAPI";


function PostContent(props) {
    const [post, setPost] = useState(null);

    /* postHeaderData = {
     *
     *      course_name : String,
     *      board_name  : String,
     *      author_name : String,
     *      title : String,
     *      post_date : Date,
     *      post_user_custom_tag : [
     *          {
     *              tag_id : Int32,
     *              tag_name : String
     *          }
     *      ], 
     *
     *      post_tags : [
     *          {
     *              tag_id : Int32,
     *              tag_name : String
     *          }
     *      ] 
     *
     * }
     *
     */
    const [postHeaderData, setPostHeaderData] = useState({});
    const [postDescription, setPostDescription] = useState("");
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");

    const postId = props.postId;
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await GetPostContent(postId);
                console.log(data)
                // setPostHeaderData();

                setPostDescription(data.description);
                setComments(data.comments);
            } catch (err) {
                setError("載入貼文失敗：" + (err.message || "未知錯誤"));
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, []);

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;


        // 
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
    if (postHeaderData) return <p>找不到貼文</p>;

    return (
        <PostContainer>
            <PostHeader>
                <Title>{postHeaderData.board_name} / {postHeaderData.title}</Title>
                <Info>
                    發文者：{postHeaderData.author_name} | 發文時間：{formatDate(postHeaderData.post_date)}
                </Info>
            </PostHeader>

            <Description>{postDescription}</Description>

            <TagList>
                {postHeaderData.post_tags && postHeaderData.post_tags.length > 0 ? (
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

                {!comments || comments.length === 0 ? (
                    <p>目前尚無留言。</p>
                ) : (
                    comments.map((comment) => (
                        <CommentCard key={comment.comment_id}>
                            <CommentInfo>
                                使用者 {comment.comment_by_user_name}（{comment.comment_user_custom_tag}）於{" "}
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
