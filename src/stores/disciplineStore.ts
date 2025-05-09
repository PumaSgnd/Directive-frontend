import { create } from 'zustand';
import { Discipline as DisciplineType } from '../types/discipline';

interface DisciplineState {
  disciplines: DisciplineType[];
  loading: boolean;
  selectedDiscipline: DisciplineType | null;
  sidebarOpen: boolean;
  pageTitle: string;
  setDisciplines: (disciplines: DisciplineType[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedDiscipline: (discipline: DisciplineType | null) => void;
  toggleSidebar: () => void;
  setPageTitle: (title: string) => void;
}

export const useDisciplineStore = create<DisciplineState>((set) => ({
  disciplines: [],
  loading: true,
  selectedDiscipline: null,
  sidebarOpen: true,
  pageTitle: 'Discipline',
  setDisciplines: (disciplines) => set({ disciplines }),
  setLoading: (loading) => set({ loading }),
  setSelectedDiscipline: (discipline) => set({ selectedDiscipline: discipline }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
