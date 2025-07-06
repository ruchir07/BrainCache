import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import { Navigate } from 'react-router-dom';
import SharedNotes from './pages/SharedNotes';
import { Toaster } from "sonner";
import './App.css'
import { useAuthStore } from './store/AuthStore';

function App() {
  
  const { token, setToken, setUser} = useAuthStore();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://braincache-backend.onrender.com/api/auth/profile", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.token);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return(
      <>
        <Toaster position='bottom-right' richColors closeButton />
        <Router>
          <Routes>
            <Route path="/" element = {token ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={token ? <Home /> : <Login />} />
            <Route path="/shared/:hash" element={<SharedNotes />} />
          </Routes>
        </Router>
      </>  
    )
}

export default App
