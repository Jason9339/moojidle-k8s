import { useNavigate } from "react-router-dom";

const CreatePostButton = () => {
    const navigate = useNavigate();
    return (
        <button className="px-4 py-2 rounded font-medium transition 
               bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/post-edit")}>
            create post
        </button>
    )
}

export default CreatePostButton;
