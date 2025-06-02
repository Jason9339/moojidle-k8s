import React, { useState } from 'react';
import styles from "./EditSecondaryLayout.module.css";

function EditSecondaryLayout({ user_tags = [], onSave, onCancel }) {
    const [tags, setTags] = useState(user_tags);

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
                <button onClick={() => onSave(tags)} className={styles.saveBtn}>儲存</button>
                <button onClick={onCancel} className={styles.cancelBtn}>取消</button>
            </div>
        </div>
    );
}

export default EditSecondaryLayout;