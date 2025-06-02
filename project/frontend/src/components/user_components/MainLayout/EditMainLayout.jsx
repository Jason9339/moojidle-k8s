import React, { useState } from 'react';
import styles from "./EditMainLayout.module.css";

function EditMainLayout({ contact_ways = [], onSave, onCancel }) {
    const [contacts, setContacts] = useState(contact_ways);

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
                <button onClick={() => onSave(contacts)} className={styles.saveBtn}>儲存</button>
                <button onClick={onCancel} className={styles.cancelBtn}>取消</button>
            </div>
        </div>
    );
}

export default EditMainLayout;