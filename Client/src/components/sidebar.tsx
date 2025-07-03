import {
   VideoIcon,
  FileTextIcon,
  LinkIcon,
  LogOut,
} from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/AuthStore";

const navItems = [
  { label: "Notes", value: "note", icon: <FileTextIcon className="w-5 h-5" /> },
  {
    label: "Documents",
    value: "file",
    icon: <VideoIcon className="w-5 h-5" />,
  },
  { label: "Links", value: "link", icon: <LinkIcon className="w-5 h " /> },
];

const Sidebar = () => {
  const { activeCategory, setCategory } = useCategoryStore();
  const { logout } = useAuthStore();

  const handleLogout = () =>{
    logout();
    window.location.href = "/";
  }

  return (
    <aside className="w-64 h-lvh bg-gray-800 text-white p-4 space-y-3">
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
