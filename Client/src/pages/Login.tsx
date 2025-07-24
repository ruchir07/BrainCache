import { useEffect } from "react";
import { useAuthStore } from "../store/AuthStore";


const Login = () => {
  
  const { setUser, setToken } = useAuthStore();
  useEffect(() => {
    
    const fetchUser = async() => {
      const res = await fetch("https://braincache-backend.onrender.com/api/auth/profile", {
        credentials: "include",
      });
      if(res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);

      }
    };
    fetchUser();
  },[]);

  const handleLogin = () => {
    window.location.href = "https://braincache-backend.onrender.com/api/auth/google";
  };

  return (
  <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-white">
    <h1 className="text-4xl font-bold mb-6">Welcome to BrainCache</h1>
    <p className="text-gray-400 mb-8 text-center max-w-md">
      Your digital memory for saving and organizing everything that matters.
    </p>
    <button
      onClick={handleLogin}
      className="px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition font-medium"
    >
      Sign in with Google
    </button>
  </div>
);
};

export default Login;
