import React from 'react';
import styles from './ToDoItem.module.css';

function ToDoItem({ todoList }) {
  const getStatus = (startDate, dueDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (now < start) return 'upcoming';
    if (now >= start && now <= due) return 'ongoing';
    return 'expired';
  };

  const renderStatus = (status) => {
    const labelMap = {
      upcoming: '未到',
      ongoing: '進行中',
      expired: '已過期',
    };
    return <span className={`todo-status status-${status}`}>{labelMap[status]}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div>
      {todoList.map((item, index) => {
        const status = getStatus(item.start_date, item.due);
        return (
          <div key={index} className={`${styles["todo-item"]}`}>
            <p className={`${styles["todo-title"]}`}>{item.title}</p>
            <p className={`${styles["todo-course"]}`}>{item.course}</p>
            {/* <p className={`${styles["todo-meta-row"]}`}>
              <span>開始：{formatDate(item.start_date)}</span>
            </p> */}
            <p className={`${styles["todo-meta-row"]}`}>
              <span>截止：{formatDate(item.due)}</span>
              {renderStatus(status)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ToDoItem;
