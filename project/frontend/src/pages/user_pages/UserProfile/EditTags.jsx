import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserTagsById, EditUserTags } from "@/services/UserApi";
import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";

function EditTags() {
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
    const [userTags, setUserTags] = useState([]);
    const [editingTag, setEditingTag] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 載入標籤
    useEffect(() => {
        async function fetchTags() {
            try {
                const data = await GetUserTagsById(userId);
                if (data && Array.isArray(data)) {
                    // 從資料庫取得的標籤陣列
                    const tags = data.map(tag => tag.user_tag);
                    setUserTags(tags);
                }
                setIsLoading(false);
            } catch (e) {
                setError("無法載入標籤。");
                setIsLoading(false);
            }
        }
        fetchTags();
    }, [userId]);

    // 新增標籤
    const handleAddTag = () => {
        if (editingTag.trim() === "") {
            setError("標籤不能為空。");
            return;
        }
        setUserTags([...userTags, editingTag.trim()]);
        setEditingTag("");
        setError("");
    };

    // 修改標籤
    const handleTagChange = (index, newValue) => {
        const updatedTags = [...userTags];
        updatedTags[index] = newValue;
        setUserTags(updatedTags);
    };

    // 刪除標籤
    const handleRemoveTag = (index) => {
        const updatedTags = [...userTags];
        updatedTags.splice(index, 1);
        setUserTags(updatedTags);
    };

    // 儲存標籤
    const handleSave = async () => {
        try {
            // 過濾空白標籤
            const validTags = userTags.filter(tag => tag.trim() !== "");
            const response = await EditUserTags(userId, validTags);
            
            if (response.message === "Tags replaced successfully") {
                navigate("/user/profile");
            } else {
                setError("儲存標籤失敗。");
            }
        } catch (e) {
            console.error("儲存標籤錯誤:", e);
            setError("儲存標籤失敗。");
        }
    };

    if (isLoading) {
        return <div>載入中...</div>;
    }

    return (
        <div className="flex">
            <LeftBar />
            <div className="flex-1 p-4">
                <h2 className="text-2xl font-bold mb-4">編輯個人標籤</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                {/* 現有標籤列表 */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">現有標籤</h3>
                    <div className="space-y-2">
                        {userTags.map((tag, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => handleTagChange(index, e.target.value)}
                                    className="border p-2 flex-1 rounded"
                                />
                                <Button 
                                    onClick={() => handleRemoveTag(index)}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    刪除
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 新增標籤 */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">新增標籤</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={editingTag}
                            onChange={(e) => setEditingTag(e.target.value)}
                            placeholder="輸入新標籤"
                            className="border p-2 flex-1 rounded"
                        />
                        <Button 
                            onClick={handleAddTag}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            新增
                        </Button>
                    </div>
                </div>
                {/* 儲存按鈕 */}
                <Button 
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600"
                >
                    儲存
                </Button>       
            </div>
        </div>
    );
}

export default EditTags;