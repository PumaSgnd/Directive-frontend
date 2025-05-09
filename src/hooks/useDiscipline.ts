import { useDisciplineStore } from '../stores/disciplineStore';
import { fetchDisciplines, deleteDiscipline } from '../api/datamaster/discipline/discipline';

export const useDiscipline = () => {
  const { setDisciplines, setLoading } = useDisciplineStore();

  const loadDisciplines = async () => {
    setLoading(true);
    try {
      const data = await fetchDisciplines();
      setDisciplines(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeDiscipline = async (id: number) => {
    try {
      await deleteDiscipline(id);
      await loadDisciplines();
    } catch (error) {
      console.error(error);
    }
  };

  return { loadDisciplines, removeDiscipline };
};
