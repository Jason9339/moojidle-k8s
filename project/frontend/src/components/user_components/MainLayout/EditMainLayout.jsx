import React, { useState } from 'react';
import styles from "./EditMainLayout.module.css";
import { UpdateUserData } from "@/services/UserApi";

function EditMainLayout({ contact_ways = [], onSave, onCancel }) {
    const [contacts, setContacts] = useState(contact_ways);
    const [loading, setLoading] = useState(false);
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    const handleChange = (index, field, value) => {
        setContacts(contacts.map((c, i) =>
            i === index ? { ...c, [field]: value } : c
        ));
    };

    const handleAdd = () => {
        setContacts([...contacts, { approach: '', details: '' }]);
    };

    const handleRemove = (index) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // 只送出有效資料
            const validContacts = contacts
                .filter(c =>
                    c &&
                    typeof c === "object" &&
                    typeof c.approach === "string" &&
                    typeof c.details === "string" &&
                    c.approach.trim() !== "" &&
                    c.details.trim() !== ""
                )
                .map(c => ({
                    approach: c.approach.trim(),
                    details: c.details.trim()
                }));

            await UpdateUserData(userId, { contactWays: validContacts });
            onSave(validContacts);
        } catch (err) {
            alert("儲存失敗，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ul className={styles.contactList}>
                {contacts.map((contact, idx) => (
                    <li key={idx}>
                        <input
                            type="text"
                            value={contact.approach}
                            onChange={e => handleChange(idx, 'approach', e.target.value)}
                            placeholder="Type (e.g. email, phone)"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={contact.details}
                            onChange={e => handleChange(idx, 'details', e.target.value)}
                            placeholder="Details"
                            className={styles.input}
                        />
                        <button onClick={() => handleRemove(idx)} className={styles.removeBtn}>刪除</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleAdd} className={styles.addBtn}>新增聯絡方式</button>
            <div style={{ marginTop: 16 }}>
                <button onClick={handleSave} className={styles.saveBtn} disabled={loading}>
                    {loading ? "儲存中..." : "儲存"}
                </button>
                <button onClick={onCancel} className={styles.cancelBtn} disabled={loading}>取消</button>
            </div>
        </div>
    );
}

export default EditMainLayout;