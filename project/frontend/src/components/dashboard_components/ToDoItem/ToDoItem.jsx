import React from "react";
import styles from "./ToDoItem.module.css";

function ToDoItem({ todoList }) {
    const Show = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);

        if (now < due) {
            return true;
        }

        return false;
    };

    // const renderStatus = (status) => {
    //     const labelMap = {
    //         upcoming: "未到",
    //         ongoing: "進行中",
    //         expired: "已過期",
    //     };
    //     return (
    //         <span
    //             className={`${styles["todo-status"]} ${
    //                 styles[`status-${status}`]
    //             }`}
    //         >
    //             {labelMap[status]}
    //         </span>
    //     );
    // };

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
            {todoList.map((item, index) => {
                return Show(item.due) === true ? (
                    <div key={index} className={`${styles["todo-item"]}`}>
                        <p className={`${styles["todo-title"]}`}>
                            {item.title}
                        </p>
                        <p className={`${styles["todo-course"]}`}>
                            {item.course}
                        </p>
                        <p className={`${styles["todo-meta-row"]}`}>
                            <span>截止：{formatDate(item.due)}</span>
                        </p>
                    </div>
                ) : null
            })}
        </div>
    );
}

export default ToDoItem;
