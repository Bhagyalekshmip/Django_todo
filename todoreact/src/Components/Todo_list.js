    //a listing page with list od task with delete update icons and completed / not completed icons
    import axios from 'axios';
    import { useEffect, useState } from 'react';
    import Modalbox from './Modalbox';
    import DeleteModal from './DeleteModal';
    import './Todo_list.css'; // Assuming you have some styles in App.css
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
        // Fetch todos from the server when the component mounts
        const token = localStorage.getItem('token');
       axios.get(`http://127.0.0.1:8000/gettask/?page=${page}&status=${currentFilter}`, {
              headers: { Authorization: `Token ${token}` }  
            })
            .then(response => {
                console.log("Todos fetched successfully", response.data);
                  setTodos(response.data.results); // results = paginated items
          setTotalPages(Math.ceil(response.data.count / 5)); // 5 = page_size
                  // set only the array part

                }
            )
            .catch(error => {
                console.error("There was an error fetching the todos!", error);
                alert("Failed to fetch todos. Please try again.");
            });
        }, [page, currentFilter]);
    // ------------------DELETE FUNCTION------------------
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
    showToast("Task deleted successfully!", "error"); // ✅ show toast
  })
  .catch(() => {
    alert("Delete failed");
    setShowDeleteModal(false);
  });
};

    // -------------------------------------------------------
    // ------------------TOGGLE COMPLETE FUNCTION------------------
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
  .catch(() => alert("Failed to update task status."));
      };
    // ---------------------------------------------------------
    // ------------------SEARCH FUNCTION------------------
    const handleSearchChange = (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const token = localStorage.getItem('token');

      axios.get(`http://127.0.0.1:8000/searchtask/`, {
        headers: { Authorization: `Token ${token}` },
        params: { query: searchTerm } // Use 'query' to match Django's request.query_params.get('query')
      })
      .then(response => {
        setTodos(response.data); // No pagination in your view; use directly
      })
      .catch(error => {
        console.error("There was an error searching the todos!", error);
        alert("Search failed. Please try again.");
      });
    };
    // ---------------------------------------------------------
    // ------------------OPEN MODAL AND UPDATE TASK FUNCTION------------------
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
          showToast('Task updated successfully!', 'success');  // ✅ show toast here
        })
        .catch(() => alert("Update failed"));
      };
    // ---------------------------------------------------------

    const fetchTodosByStatus = (status) => {
       setCurrentFilter(status); // ✅ store the filter
  setPage(1);
  const token = localStorage.getItem('token');
    axios.get(`http://127.0.0.1:8000/gettask/?page=1&status=${status}`, {
    headers: { Authorization: `Token ${token}` }
  })
  .then(response => {
    setTodos(response.data.results);
    setTotalPages(Math.ceil(response.data.count / 5));
  })
  .catch(error => {
    console.error("Error fetching filtered tasks:", error);
    alert("Failed to filter tasks.");
  });
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
                        <button onClick={() => openDeleteModal(todo)}>
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

                <button onClick={() => navigate('/add')} className="add-todo-button">   
                    Add Todo
                </button>

                {/* Pagination Controls */}
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>

          
                < Modalbox
            show={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            task={editingTask}
          />
            <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
        <DeleteModal
  show={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={confirmDelete}
  task={taskToDelete}
/>

        </div>
      );
    }
    export default TodoList;