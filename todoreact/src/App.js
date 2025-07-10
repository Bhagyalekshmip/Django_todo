import{ useState } from 'react';
import './App.css';   
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    axios .post('http://127.0.0.1:8000/apisignup/', { username, email, password })
      .then(response => {
        console.log("Signup successful", response.data);
        navigate('/login'); // Redirect to login after signup
      })
      .catch(error => {
        console.error("There was an error signing up!", error);
        return error.response.data;
      });
    // Here you would typically send the data to your backend
    console.log({ username, email, password });
    // navigate('/login'); // Redirect to login after signup
  };

  return (
    
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form" >
        <h2>Signup</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit" className='hi'>Signup</button>
      </form>
    </div>
  );
}

export default App
