import React from 'react';
import '@/styles/ComingUpItem.css';

function ComingUpItem({ comingUpList }) {
  return (
    <div>
      {comingUpList.length === 0 ? (
        <p className="comingup-empty">No upcoming events</p>
      ) : (
        comingUpList.map((item, index) => (
          <div key={index} className="comingup-item">
            <p className="comingup-title">{item.title}</p>
            <p className="comingup-date">{item.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ComingUpItem;