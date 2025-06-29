// src/components/Navbar.tsx
import { useAuthStore } from "../store/AuthStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', { credentials: 'include' });
    logout();
  };

  return (
    <div className="p-4 bg-gray-100 shadow-md flex justify-between">
      <div>🧠 BrainCache</div>
      {user ? (
        <div className="flex gap-4 items-center">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="text-red-500">Logout</button>
        </div>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
};

export default Navbar;