import axios from "axios";
import { Discipline } from "../../../types/discipline";

const API_URL = "http://localhost:5000/api/discipline";

export const fetchDisciplines = async () => {
  try {
    const response = await axios.get<Discipline[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching disciplines:", error);
    throw error;
  }
};

export const createDiscipline = async (data: Omit<Discipline, "id">) => {
  try {
    const response = await axios.post<Discipline>(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Discipline created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating discipline:", error);
    throw error;
  }
};

export const updateDiscipline = async (id: number, data: Omit<Discipline, "id">) => {
  try {
    const response = await axios.put<Discipline>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating discipline:", error);
    throw error;
  }
};

export const deleteDiscipline = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting discipline:", error);
    throw error;
  }
};
