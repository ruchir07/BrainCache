import { create } from 'zustand';

interface AuthState {
    user:  any;
    token: string | null;
    setUser: (user:any) => void;
    setToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({

    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    logout: () => {
        set({token:null , user:null});
        fetch('http://localhost:3000/api/auth/logout', {
            credentials: 'include',
        }).catch(() => {});
    }
}));
