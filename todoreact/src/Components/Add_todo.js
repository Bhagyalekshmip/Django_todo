// a form to add task title and due_date
import React, { useState } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';
import './AddTodo.css';
function AddTodo() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log("Adding todo", { title, dueDate});
    console.log(token) // Get token from local storage
    axios.post('http://127.0.0.1:8000/addtask/', { title, due_date: dueDate }, {
      headers: { Authorization: `Token ${token}` }
    })
    
      .then(response => {
        console.log("Todo added successfully", response.data);
        
        navigate('/todo_list'); // Redirect to todo list after adding
      } )
      .catch(error => { 
        console.log(error.response.data)
        console.error("There was an error adding the todo!", error);
        alert("Failed to add todo. Please try again.");
      })
  };

    return (
        <div className="add-todo-container">
        <form onSubmit={handleSubmit} className="add-todo-form">
            <h2>Add Todo</h2>
            <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
            <input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            />
            <button type="submit">Add Todo</button>
        </form>
        </div>
    );
}
export default AddTodo;