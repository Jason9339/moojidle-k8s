import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ComingUpItem.module.css";

function ComingUpItem({ comingUpList }) {
    const Navigate = useNavigate();
    const Show = (startDate) => {
        const now = new Date();
        const due = new Date(startDate);

        if (now < due) {
            return true;
        }

        return false;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("zh-TW", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    };

    return (
        <div>
            {comingUpList.map((item, index) => (
                Show(item.date) == true ? (
                    <div key={index} className={`${styles["comingup-item"]}`} onClick={() => Navigate(`/course/${item.course_id}`)}>
                        <p className={`${styles["comingup-title"]}`}>
                            {item.title}
                        </p>
                        <p className={`${styles["comingup-date"]}`}>
                            時間：{formatDate(item.date)}
                        </p>
                    </div>
                ) : null
            ))}
        </div>
    );
}

export default ComingUpItem;
