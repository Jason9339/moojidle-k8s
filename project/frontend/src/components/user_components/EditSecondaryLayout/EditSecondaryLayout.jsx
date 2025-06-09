import React, { useState, useRef, useEffect } from 'react';
import styles from "./EditSecondaryLayout.module.css";
import { UpdateUserTags } from "@/services/UserApi";
import { LuPlus } from "react-icons/lu";

function EditSecondaryLayout({ user_tags = [], onSave, onCancel }) {
    const [tags, setTags] = useState(user_tags);
    const [loading, setLoading] = useState(false);
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
    const [errorIndexes, setErrorIndexes] = useState([]);
    const spanRefs = useRef([]);
    useEffect(() => {
        tags.forEach((tag, idx) => {
            const span = spanRefs.current[idx];
            const input = document.getElementById(`tag-input-${idx}`);
            if (span && input) {
                input.style.width = `${span.offsetWidth + 20}px`; // + padding buffer
            }
        });
    }, [tags]);

    const handleChange = (index, value) => {
        // if (value.length > 30) {
        //     setErrorIndexes([...new Set([...errorIndexes, index])]);
        //     return;
        // } else {
        //     setErrorIndexes(errorIndexes.filter(i => i !== index));
        // }
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
            <div className={styles.tagList}>
                {tags.map((tag, idx) => (
                    <li key={idx} className={styles.tagItem}>
                        <input
                            id={`tag-input-${idx}`}
                            type="text"
                            value={tag.user_tag}
                            onChange={e => handleChange(idx, e.target.value)}
                            placeholder="Tag"
                            maxLength={35}
                            className={styles.input}
                        />
                        {/* 隱藏的 span，用於測量寬度 */}
                        <span
                            ref={el => spanRefs.current[idx] = el}
                            className={styles.hiddenSpan}
                        >
                            {tag.user_tag || "Tag"}
                        </span>

                        <span
                            onClick={() => handleRemove(idx)}
                            className={styles.removeIcon}
                            role="button"
                            aria-label="移除標籤"
                        >
                            ×
                        </span>
                    </li>
                ))}
                <button onClick={handleAdd} className={styles.addBtn} aria-label="新增標籤">
                    <LuPlus />
                </button>
            </div>
            <div className={styles.buttonGroup} >
                <button onClick={onCancel} className={styles.cancelBtn}>取消</button>
                <button onClick={handleSave} className={styles.saveBtn}>儲存</button>
            </div>
        </div >
    );
}

export default EditSecondaryLayout;