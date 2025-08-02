import{ useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
   
    axios .post('http://127.0.0.1:8000/apisignup/', { email})
      .then(response => {
        console.log("Signup successful", response.data);
        navigate('/login'); // Redirect to login after signup
      })
      .catch(error => {
        console.error("There was an error signing up!", error);
        return error.response.data;
      });
    // Here you would typically send the data to your backend
    console.log({email});
    // navigate('/login'); // Redirect to login after signup
  };

  return (
    
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form" >
        <h2>Forget Passsword</h2>
        <p>Please enter your email address you'd like your reset information sents to</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" className='hi'>Signup</button>
      </form>
     
    </div>
  );
}

export default ForgetPassword
