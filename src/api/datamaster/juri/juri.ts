import axios from "axios";
import { Juri } from "../../../types/juri";

const API_URL = "http://localhost:5000/api/juri";

export const fetchJuri = async () => {
  try {
    const response = await axios.get<Juri[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching Juri:", error);
    throw error;
  }
};

export const createJuri = async (data: Omit<Juri, "id">) => {
  try {
    const response = await axios.post<Juri>(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Juri created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Juri:", error);
    throw error;
  }
};

export const updateJuri= async (id: number, data: Omit<Juri, "id">) => {
  try {
    const response = await axios.put<Juri>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating Juri:", error);
    throw error;
  }
};

export const deleteJuri= async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting Juri:", error);
    throw error;
  }
};
