function PostPreview(props) {
    const post = props.post;
    return (
        <div
            key={post.post_id}
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "12px"
            }}
        >
            <h3>{post.title}</h3>
            <p><strong>發文者：</strong>{post.post_by_user_id}</p>
            <p><strong>時間：</strong>{new Date(post.post_date).toLocaleString()}</p>
            <p>{post.description}</p>
            <p><strong>留言數：</strong>{post.comments?.length ?? 0}</p>
        </div>

    )
}

export default PostPreview;
