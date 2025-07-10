  // EditModal.js
  import React, { useState, useEffect } from 'react';

  const Modalbox = ({ show, onClose, onSave, task }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
      if (task) {
        setTitle(task.title);
        setDueDate(task.due_date?.slice(0, 10)); // Format for input[type="date"]
      }
    }, [task]);

    if (!show) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Edit Task</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button onClick={() => onSave({ title, due_date: dueDate })}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  };

  export default Modalbox;
