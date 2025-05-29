import React from "react";
import PropTypes from "prop-types";
import styles from "./NotificationCard.module.css";
import { FiTrash } from "react-icons/fi"; 

function NotificationCard({ item, onDelete }) {
    const date = new Date(item.notification.notified_date);
    const formattedDate = date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short"
    });
    const categoryMap = {
        course: "課程",
    };
    const displayCategory = categoryMap[item.notification.event_category] || item.notification.event_category;
    return (
        <div
            className={`${styles.row} ${item.is_read ? styles.read : styles.unread}`}
        >
            <div className={styles.sender}>
                系統通知 - {displayCategory}
            </div>
            <div className={styles.content}>
                <span className={styles.context}>{item.notification.context}</span>
            </div>
            <div className={styles.date}>
                {formattedDate}
            </div>
            <div className={styles.delete} onClick={() => onDelete(item._id)} title="刪除通知">
                <FiTrash size={20} />
            </div>
        </div>
    );
}

NotificationCard.propTypes = {
    item: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default NotificationCard;
