import React from 'react';
import './ComingUpItem.css';

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
        <p className="comingup-empty">近期無活動</p>
      ) : (
        comingUpList.map((item, index) => (
          <div key={index} className="comingup-item">
            <p className="comingup-title">{item.title}</p>
            <p className="comingup-date">時間：{formatDate(item.date)}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ComingUpItem;
