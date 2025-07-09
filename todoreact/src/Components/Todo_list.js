//a listing page with list od task with delete update icons and completed / not completed icons
import axios from 'axios';
import { useState } from 'react';
import Modalbox from './Modalbox';
import './Todo_list.css'; // Assuming you have some styles in App.css
import { FaTrash, FaEdit, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useState(() => {
    // Fetch todos from the server when the component mounts
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/gettask/', {
          headers: { Authorization: `Token ${token}` }  
        })
        .then(response => {
            console.log("Todos fetched successfully", response.data);
            setTodos(response.data.tasks);  // set only the array part

            }
        )
        .catch(error => {
            console.error("There was an error fetching the todos!", error);
            alert("Failed to fetch todos. Please try again.");
        });
    }, []);
// ------------------DELETE FUNCTION------------------
  const deleteTodo = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:8000/deletetask/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
    .then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    })
    .catch(() => alert("Delete failed"));
    // You might want to handle the response or error her
  };
// -------------------------------------------------------
// ------------------TOGGLE COMPLETE FUNCTION------------------
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
// ---------------------------------------------------------
// ------------------OPEN MODAL AND UPDATE TASK FUNCTION------------------
  const openModalbox = (todo) => {
    setEditingTask(todo);
    setShowModal(true);
  };

    const handleSave = (updatedData) => {
    const token = localStorage.getItem('token');
    axios.put(`http://127.0.0.1:8000/updatetask/${editingTask.id}/`, updatedData, {
      headers: { Authorization: `Token ${token}` },
    })
    .then(() => {
      setTodos(todos.map(todo => 
        todo.id === editingTask.id ? { ...todo, ...updatedData } : todo
      ));
      setShowModal(false);
    })
    .catch(() => alert("Update failed"));
  };
// ---------------------------------------------------------
  return (
    <div className="todo-list-container">
      <h2>Todo List</h2>
      {/* need to display all the todos here in a neat table structure */}
        <table className="todo-table">
            <thead>
            <tr>
                <th>Task</th>
                <th>Due Date</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {todos.map(todo => (
                <tr key={todo.id}>
                <td style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {todo.title}
                </td>
                <td>
                    {new Date(todo.due_date).toLocaleDateString('en-CA')}   
                </td>
                <td>
                    <button onClick={() => toggleComplete(todo.id)}>
                    {todo.completed ? <FaCheckCircle /> : <FaRegCircle />}
                    </button>
                    <button onClick={() => deleteTodo(todo.id)}>
                    <FaTrash />
                    </button>
                    <button onClick={() => openModalbox(todo)}>
                  <FaEdit />
                </button>
                </td>
                </tr>
            ))}

            </tbody>
            </table>
             < Modalbox
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        task={editingTask}
      />
            <button onClick={() => navigate('/add')} className="add-todo-button">   
                Add Todo
            </button>   
    </div>
  );
}
export default TodoList;