import React from 'react';
import styles from './ComingUpItem.module.css';

function ComingUpItem({ comingUpList }) {
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
      {comingUpList.length === 0 ? (
        <p className={`${styles["comingup-empty"]}`}>近期無活動</p>
      ) : (
        comingUpList.map((item, index) => (
          <div key={index} className={`${styles["comingup-item"]}`}>
            <p className={`${styles["comingup-title"]}`}>{item.title}</p>
            <p className={`${styles["comingup-date"]}`}>時間：{formatDate(item.date)}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ComingUpItem;
