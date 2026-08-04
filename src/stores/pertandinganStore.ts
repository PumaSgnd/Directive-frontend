import { create } from "zustand";
import { Pertandingan } from "../types/pertandingan";

interface PertandinganStore {
    pertandingan: Pertandingan[];

    selectedPertandingan: Pertandingan | null;

    setPertandingan: (data: Pertandingan[]) => void;

    setSelectedPertandingan: (data: Pertandingan | null) => void;

    clearPertandingan: () => void;

}

export const usePertandinganStore = create<PertandinganStore>((set) => ({
    pertandingan: [],

    selectedPertandingan: null,

    setPertandingan: (data) =>
        set({
            pertandingan: data,
        }),

    setSelectedPertandingan: (data) =>
        set({
            selectedPertandingan: data,
        }),

    clearPertandingan: () =>
        set({
            pertandingan: [],
            selectedPertandingan: null,
        }),
}));
