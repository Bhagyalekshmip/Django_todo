// src/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar'; // adjust path if needed

const Layout = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Outlet /> {/* Renders the current route's component */}
      </div>
    </>
  );
};

export default Layout;
