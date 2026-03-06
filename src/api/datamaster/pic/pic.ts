import axios from "axios";
import { PIC } from "../../../types/pic";

const API_URL = "http://localhost:5000/api/pic";

export const fetchPIC = async () => {
  try {
    const response = await axios.get<PIC[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching PIC:", error);
    throw error;
  }
};

export const createPIC = async (data: Omit<PIC, "id">) => {
  try {
    const response = await axios.post<PIC>(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("PIC created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating PIC:", error);
    throw error;
  }
};

export const updatePIC= async (id: number, data: Omit<PIC, "id">) => {
  try {
    const response = await axios.put<PIC>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating PIC:", error);
    throw error;
  }
};

export const deletePIC= async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting PIC:", error);
    throw error;
  }
};
