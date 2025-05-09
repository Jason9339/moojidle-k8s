import React from 'react';
import './ToDoItem.css';

function ToDoItem({ todoList }) {
  return (
    <div>
      {todoList.map((item, index) => (
        <div key={index} className="todo-item">
          <p className="todo-title">{item.title}</p>
          <p className="todo-course">{item.course}</p>
          {/* <p className="todo-meta">{item.points} pts • {item.due}</p> */}
          <p className="todo-meta">{new Date(item.due).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default ToDoItem;