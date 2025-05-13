import React, { useState } from "react";
import "./UploadModal.css";
import { uploadFile } from "@/services/FileApi";

const UploadModal = ({ onClose, courseId, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState("material");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState(""); // only for assignments

    const handleUpload = async () => {
        const user = JSON.parse(localStorage.getItem("user")); // 確保登入時有存
        const userId = user?.user_id;
        if (!userId) {
            alert("請先登入");
            return;
        }

        const formData = new FormData();
        formData.append("uploadFile", file);
        formData.append("type", type);
        formData.append("courseId", courseId);
        formData.append("createByUserId", userId);
        formData.append("description", description);

        if (type === "assignment") {
            formData.append("assName", name);
            formData.append("endDate", endDate);
        } else {
            formData.append("mName", name);
        }

        try {
            await uploadFile(formData);
            alert("上傳成功！");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("上傳時發生錯誤", error);
            alert("上傳失敗：" + error.message);
        }
    };

    return (
        <div className="upload-modal">
            <h2>上傳檔案</h2>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="material">教材</option>
                <option value="assignment">作業</option>
            </select>

            <input
                type="text"
                placeholder={type === "assignment" ? "作業名稱" : "教材名稱"}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {type === "assignment" && (
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            )}

            <textarea
                placeholder="簡介/描述"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                type="file"
                accept="*"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleUpload}>上傳</button>
            <button onClick={onClose}>取消</button>
        </div>
    );
};

export default UploadModal;
