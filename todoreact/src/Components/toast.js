import React from 'react';
import './toast.css';

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
