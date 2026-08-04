//{*/stores/penilaianStore.ts*}
import { create } from "zustand";
import { PenilaianHistoryItem, Scoreboard } from "../types/penilaian";

interface PenilaianStore {
    history: PenilaianHistoryItem[];
    scoreboard: Scoreboard | null;

    setHistory: (data: PenilaianHistoryItem[]) => void;
    setScoreboard: (data: Scoreboard | null) => void;
    clear: () => void;
}

export const usePenilaianStore = create<PenilaianStore>((set) => ({
    history: [],
    scoreboard: null,

    setHistory: (data) => set({ history: data }),
    setScoreboard: (data) => set({ scoreboard: data }),
    clear: () => set({ history: [], scoreboard: null }),
}));