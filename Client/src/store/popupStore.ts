import { create } from "zustand";

interface popupState {
    showPopup: boolean;
    link: string;
    setShowPopup: (value: boolean) => void;
    setLink: (link: string) => void;
    reset: () => void;
}

export const usePopupStore = create<popupState>((set) => ({
  showPopup: false,
  link: '',
  setShowPopup: (value) => set({ showPopup: value }),
  setLink: (link) => set({ link }),
  reset: () => set({ showPopup: false, link: '' }),
}));