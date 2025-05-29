import React from "react";
import PropTypes from "prop-types";
import styles from "./NotificationCard.module.css";

function NotificationCard({ item, onSelectChange, isSelected }) {
    const date = new Date(item.notification.notified_date);
    const formattedDate = date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short"
    });

    const categoryMap = {
        course: "課程",
        post: "討論版"
    };

    const displayCategory = categoryMap[item.notification.event_category] || item.notification.event_category;

    return (
        <div className={`${styles.row} ${item.is_read ? styles.read : styles.unread}`}>
            <div className={styles.checkbox}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectChange(item.n_id, e.target.checked)}
                />
            </div>
            <div className={styles.sender}>
                系統通知 - {displayCategory}
            </div>
            <div className={styles.content}>
                <span className={styles.context}>{item.notification.context}</span>
            </div>
            <div className={styles.date}>
                {formattedDate}
            </div>
        </div>
    );
}

NotificationCard.propTypes = {
    item: PropTypes.object.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
};

export default NotificationCard;
