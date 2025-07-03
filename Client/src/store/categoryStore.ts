import { create } from "zustand";

type Category = "all" | "note" | "file" | "link";  // Must match backend

interface CategoryState {
  activeCategory: Category;
  setCategory: (category: Category) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  activeCategory: "all",
  setCategory: (category) => set({ activeCategory: category }),
}));