import { useState } from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/sidebar';
import Home from './pages/Home';
import { Navigate } from 'react-router-dom';
import SharedNotes from './pages/SharedNotes';

import './App.css'
import { useAuthStore } from './store/AuthStore';

function App() {
  
  const user = useAuthStore((state) => state.user);

  return(
      <Router>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={user ? <Home /> : <Login />} />
          <Route path="/shared/:hash" element={<SharedNotes />} />
        </Routes>
      </Router>  
    )
}

export default App
