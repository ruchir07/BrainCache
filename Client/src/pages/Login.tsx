import { useAuthStore } from "../store/AuthStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button"

const Login = () => {
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/profile", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.token); // Optional if you’re sending a token from backend
        }
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [setUser, setToken]);

  const handleLogin = () => {
    // Redirect to your backend's Google OAuth route
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
