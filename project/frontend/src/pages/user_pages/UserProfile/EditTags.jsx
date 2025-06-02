import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserTagsById, EditUserTags } from "@/services/UserApi";
import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";

function EditTags() {
    const navigate = useNavigate();
    const [userTags, setUserTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [error, setError] = useState("");
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await GetUserTagsById(userId);
                console.log("API 回傳:", data);
                setUserTags(data.user_tags || []);
            } catch (e) {
                setError("無法載入使用者標籤。");
            }
        }
        fetchData();
    }, [userId]);
    const handleAddTag = () => {
        if (newTag.trim() === "") {
            setError("標籤不能為空。");
            return;
        }
        setUserTags([...userTags, { user_tag: newTag.trim() }]);
        setNewTag("");
        setError("");
    };

    const handleRemoveTag = (index) => {
        const updatedTags = [...userTags];
        updatedTags.splice(index, 1);
        setUserTags(updatedTags);
    };

    const handleSave = async () => {
        try {
            await EditUserTags(userId, userTags);
            navigate("/user/profile");
        } catch (e) {
            setError("無法儲存標籤。");
        }
    };

    return (
        <div className="edit-tags-container">
            <LeftBar />
            <div className="edit-tags-content">
                <h2>編輯個人標籤</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="tag-input-section">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="新增標籤"
                    />
                    <Button onClick={handleAddTag}>新增</Button>
                </div>
                <ul className="tag-list">
                    {userTags.map((tag, index) => (
                        <li key={index} className="tag-item">
                            {tag.user_tag}
                            <button onClick={() => handleRemoveTag(index)}>移除</button>
                        </li>
                    ))}
                </ul>
                <Button onClick={handleSave}>儲存變更</Button>
            </div>
        </div>
    );

}

export default EditTags;