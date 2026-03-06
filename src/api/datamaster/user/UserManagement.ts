import axios from "axios";
import { User } from "../../../types/user";

const API_URL = "http://localhost:5000/api/user";

export const fetchUser = async () => {
  try {
    const response = await axios.get<User[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching User:", error);
    throw error;
  }
};

export const createUser = async (data: Omit<User, "id">) => {
  try {
    const response = await axios.post<User>(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("User created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating User:", error);
    throw error;
  }
};

export const updateUser = async (id: number, data: Omit<User, "id">) => {
  try {
    const response = await axios.put<User>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating User:", error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting User:", error);
    throw error;
  }
};
