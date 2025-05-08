import { Link } from "react-router-dom";

function PostPreview(props) {
    const post = props.post;
    return (
        <Link
            key={post.post_id}
            to={`/post/${post.post_id}`}
            style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                borderRadius: "8px",
                transition: "box-shadow 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9f9f9";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
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

        </Link>
    )
}

export default PostPreview;
