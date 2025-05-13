import React, { useState } from "react";
import "./UploadModal.css";
import { uploadFile } from "@/services/FileApi";

const UploadModal = ({ onClose, courseId, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState("material");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState(""); // only for assignments
    const [displayDate, setDisplayDate] = useState(""); // for materials
    const [startDate, setStartDate] = useState(""); // for assignments

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
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
        } else {
            formData.append("mName", name);
            formData.append("displayDate", displayDate);
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
            <div className="input-group">
                <label htmlFor="type">選擇類型</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="material">教材</option>
                    <option value="assignment">作業</option>
                </select>
            </div>

            <div className="input-group">
                <label htmlFor="name">{type === "assignment" ? "作業名稱" : "教材名稱"}</label>
                <input
                    id="name"
                    type="text"
                    placeholder={type === "assignment" ? "作業名稱" : "教材名稱"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {type === "assignment" && (
                <>
                    <div className="input-group">
                        <label htmlFor="startDate">開始日期</label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="endDate">結束日期</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </>
            )}

            {type === "material" && (
                <div className="input-group">
                    <label htmlFor="displayDate">顯示日期</label>
                    <input
                        id="displayDate"
                        type="date"
                        value={displayDate}
                        onChange={(e) => setDisplayDate(e.target.value)}
                    />
                </div>
            )}

            <label htmlFor="description">簡介/描述</label>
            <textarea
                id="description"
                placeholder="簡介/描述"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <label htmlFor="file">選擇檔案</label>
            <input
                type="file"
                accept="*"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="button-group">
                <button onClick={onClose}>取消</button>
                <button onClick={handleUpload}>上傳</button>
            </div>
        </div>
    );
};

export default UploadModal;
