import React, { useState } from 'react';
import styles from "./EditSecondaryLayout.module.css";
import { UpdateUserTags } from "@/services/UserApi";


function EditSecondaryLayout({ user_tags = [], onSave, onCancel }) {
    const [tags, setTags] = useState(user_tags);
    const [loading, setLoading] = useState(false);
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    const handleChange = (index, value) => {
        setTags(tags.map((tag, i) =>
            i === index ? { ...tag, user_tag: value } : tag
        ));
    };

    const handleAdd = () => {
        setTags([...tags, { user_tag: "" }]);
    };

    const handleRemove = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };
    const handleSave = async () => {
        setLoading(true);
        try {
            const validTags = tags
            .filter(tag => tag && tag.user_tag && tag.user_tag.trim() !== "")
            .map(tag => tag.user_tag.trim());

            console.log('準備儲存的標籤:', validTags);

            await UpdateUserTags(userId, validTags);
            onSave(validTags.map(tag => ({ user_tag: tag })));
        } catch (err) {
            console.error('儲存失敗:', err);
            alert(err.message || "儲存失敗，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ul className={styles.tagList}>
                {tags.map((tag, idx) => (
                    <li key={idx} className={styles.tagItem}>
                        <input
                            type="text"
                            value={tag.user_tag}
                            onChange={e => handleChange(idx, e.target.value)}
                            placeholder="Tag"
                            className={styles.input}
                        />
                        <button onClick={() => handleRemove(idx)} className={styles.removeBtn}>刪除</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleAdd} className={styles.addBtn}>新增 TAG</button>
            <div style={{ marginTop: 16 }}>
                <button onClick={handleSave} className={styles.saveBtn}>儲存</button>
                <button onClick={onCancel} className={styles.cancelBtn}>取消</button>
            </div>
        </div>
    );
}

export default EditSecondaryLayout;