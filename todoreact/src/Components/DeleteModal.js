// DeleteModal.js
import React from 'react';
// import './Modalbox.css'; // Reuse same styles as edit modal

const DeleteModal = ({ show, onClose, onConfirm, task }) => {
  if (!show || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Delete Task</h3>
        <p>Are you sure you want to delete the task: <strong>{task.title}</strong>?</p>
        <button onClick={onConfirm} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteModal;
