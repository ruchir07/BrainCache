import { VideoIcon, FileTextIcon, LinkIcon, LogOut } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/AuthStore"; // assuming you store token/user
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"


const navItems = [
  { label: "Notes", value: "note", icon: <FileTextIcon className="w-5 h-5" /> },
  {
    label: "Documents",
    value: "file",
    icon: <VideoIcon className="w-5 h-5" />,
  },
  { label: "Links", value: "link", icon: <LinkIcon className="w-5 h-5" /> },
];

const Sidebar = () => {
  const { activeCategory, setCategory } = useCategoryStore();
  const { logout, token } = useAuthStore();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await fetch("https://braincache-backend.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      logout(); 
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout error");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/", {replace:true});
    }
  }, [token]);

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col justify-between p-4">
      <div>
        <h1 className="text-xl font-bold mb-6">BrainCache</h1>
        <ul className="space-y-6">
          {navItems.map((item) => (
            <li
              key={item.label}
              className={`flex items-center gap-3 cursor-pointer px-2 py-1 rounded-lg transition-all
                ${
                  activeCategory === item.value
                    ? "bg-purple-600 text-white"
                    : "hover:text-purple-400"
                }
              `}
              onClick={() => setCategory(item.value as any)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 mt-6 px-2 py-2 rounded-md transition"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
