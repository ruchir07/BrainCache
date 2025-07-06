import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { Navigate } from 'react-router-dom';
import SharedNotes from './pages/SharedNotes';
import { Toaster } from "sonner";
import './App.css'
import { useAuthStore } from './store/AuthStore';

function App() {
  
  const token = useAuthStore((state) => state.token);

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
