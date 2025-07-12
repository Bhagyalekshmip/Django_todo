// src/Components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand">Todo</Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        {isRegisterPage && <Link to="/login">Login</Link>}
        {isLoginPage && <Link to="/">Signup</Link>}
        {!isLoginPage && !isRegisterPage && (
          <>
            <Link to="/todo_list">Home</Link>
            <Link to="/add">Add Todo</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
