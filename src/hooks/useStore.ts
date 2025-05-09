import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    pageTitle: string;
    setPageTitle: (title: string) => void;
    user: any;
    setUser: (user: any) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            pageTitle: "Directive",
            setPageTitle: (title: string) => set({ pageTitle: title }),
            user: null,
            setUser: (user: any) => set({ user }),
        }),
        {
            name: "store-storage",
            partialize: (state) => ({ user: state.user }),
        }
    )
);
