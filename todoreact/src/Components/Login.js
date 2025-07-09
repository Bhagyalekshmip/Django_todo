
import{ useState } from 'react';
import '../App.css';   
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    axios.post('http://127.0.0.1:8000/login/', { username, password })
      .then(response => {   
        console.log("Login successful", response.data);
        localStorage.setItem('token', response.data.token); // Store token in local storage
        navigate('/todo_list'); // Redirect to todo list after login
      })
      .catch(error => { 
        console.error("There was an error logging in!", error);
        alert("Login failed. Please check your credentials.");
      });
      };
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form" >
        <h2>Login</h2>
        <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login
