
import{ useState } from 'react';
import '../App.css';   
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [Confpassword, ConfsetPassword] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Confpassword || !password) {
      alert("Password Doesn't match");
      return;
    }

    axios.post('http://127.0.0.1:8000/login/', { password })
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
<div className="login-container">
  <form onSubmit={handleSubmit} className="login-form">
    <h2>Reset Password</h2>
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required autoFocus
    />
    <input
      type="password"
      placeholder="Confirm Password"
      value={Confpassword}
      onChange={(e) => ConfsetPassword(e.target.value)}
      required
    />
    <button type="submit">Submit</button>
  </form>
</div>

  );
}

export default ResetPassword
