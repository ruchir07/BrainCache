import { useState } from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/navbar';
import Dashboard from './pages/Dashboard';
import { Navigate } from 'react-router-dom';

import './App.css'
import { useAuthStore } from './store/AuthStore';

function App() {
  
  const { user } = useAuthStore();

  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    );
}

export default App
