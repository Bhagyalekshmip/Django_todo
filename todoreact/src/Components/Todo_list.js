import axios from 'axios';
import { useEffect, useState } from 'react';
import Modalbox from './Modalbox';
import DeleteModal from './DeleteModal';
import './Todo_list.css';
import { FaTrash, FaEdit, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Toast from './toast';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [currentFilter, setCurrentFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://127.0.0.1:8000/gettask/?page=${page}&status=${currentFilter}`, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(response => {
      setTodos(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
    })
    .catch(error => {
      console.error("Error fetching todos:", error);
      alert("Failed to fetch todos.");
    });
  }, [page, currentFilter]);

  const openDeleteModal = (todo) => {
    setTaskToDelete(todo);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:8000/deletetask/${taskToDelete.id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
    .then(() => {
      setTodos(prev => prev.filter(todo => todo.id !== taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
      showToast("Task deleted!", "error");
    })
    .catch(() => {
      alert("Delete failed");
      setShowDeleteModal(false);
    });
  };

  const toggleComplete = (taskId) => {
    const token = localStorage.getItem('token');
    axios.patch(`http://127.0.0.1:8000/togglecompletion/${taskId}/`, null, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(response => {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === taskId ? { ...todo, completed: response.data.completed } : todo
        )
      );
    })
    .catch(() => alert("Failed to update status."));
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const token = localStorage.getItem('token');

    axios.get(`http://127.0.0.1:8000/searchtask/`, {
      headers: { Authorization: `Token ${token}` },
      params: { query: searchTerm }
    })
    .then(response => {
      setTodos(response.data);
    })
    .catch(() => alert("Search failed."));
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

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
      showToast('Task updated!', 'success');
    })
    .catch(() => alert("Update failed"));
  };

  const fetchTodosByStatus = (status) => {
    setCurrentFilter(status);
    setPage(1);
  };

  return (
    <div className="todo-list-container">
      <h2>Todo List</h2>

      <input
        type="text"
        placeholder="Search tasks..."
        onChange={handleSearchChange}
        className="search-bar"
      />

      <div className="filter-buttons">
        <button onClick={() => fetchTodosByStatus('')}>All</button>
        <button onClick={() => fetchTodosByStatus('pending')}>Pending</button>
        <button onClick={() => fetchTodosByStatus('completed')}>Completed</button>
      </div>

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
              <td>{new Date(todo.due_date).toLocaleDateString('en-CA')}</td>
              <td>
                <button onClick={() => toggleComplete(todo.id)}>
                  {todo.completed ? <FaCheckCircle /> : <FaRegCircle />}
                </button>
                <button onClick={() => openDeleteModal(todo)}><FaTrash /></button>
                <button onClick={() => openModalbox(todo)}><FaEdit /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate('/add')} className="add-todo-button">
        Add Todo
      </button>

      <div className="custom-pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="pagination-btn"
        >
          ←
        </button>
        <span className="pagination-number">{page}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          →
        </button>
      </div>

      <Modalbox
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        task={editingTask}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        task={taskToDelete}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
    </div>
  );
}

export default TodoList;
