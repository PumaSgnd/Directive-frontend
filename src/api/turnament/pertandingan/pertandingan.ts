//{*/api/turnament/pertandingan/pertandingan.ts*}
import API from "../../../api/api";
import {
    Pertandingan,
    CreatePertandinganRequest,
} from "../../../types/pertandingan";

const API_URL = "/pertandingan";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const fetchPertandingan = async (babak?: string) => {
    const response = await API.get<ApiResponse<Pertandingan[]>>(
        babak ? `${API_URL}?babak=${babak}` : API_URL
    );
    return response.data.data;
};

export const fetchRiwayatPertandingan = async (babak?: string) => {
    const response = await API.get<ApiResponse<Pertandingan[]>>(
        babak ? `${API_URL}/riwayat?babak=${babak}` : `${API_URL}/riwayat`
    );
    return response.data.data;
};

export const fetchPertandinganById = async (id: number) => {
    const response = await API.get<ApiResponse<Pertandingan>>(`${API_URL}/${id}`);
    return response.data.data;
};

export const createPertandingan = async (data: CreatePertandinganRequest) => {
    const response = await API.post<ApiResponse<Pertandingan>>(API_URL, data);
    return response.data.data;
};

export const updatePertandingan = async (id: number, data: Partial<Pertandingan>) => {
    const response = await API.put<ApiResponse<Pertandingan>>(`${API_URL}/${id}`, data);
    return response.data.data;
};

export const deletePertandingan = async (id: number) => {
    await API.delete(`${API_URL}/${id}`);
};

export const startPertandingan = async (id: number) => {
    const response = await API.post<ApiResponse<Pertandingan>>(`${API_URL}/${id}/start`);
    return response.data.data;
};

export const pausePertandingan = async (id: number, sisa_detik: number) => {
    const response = await API.put<ApiResponse<Pertandingan>>(`${API_URL}/${id}/pause`, { sisa_detik });
    return response.data.data;
};

export const resumePertandingan = async (id: number) => {
    const response = await API.put<ApiResponse<Pertandingan>>(`${API_URL}/${id}/resume`);
    return response.data.data;
};

export const finishPertandingan = async (id: number) => {
    const response = await API.post<ApiResponse<any>>(`${API_URL}/${id}/finish`);
    return response.data.data;
};

export const updateTimer = async (id: number, sisa_detik: number) => {
    const response = await API.put<ApiResponse<Pertandingan>>(`${API_URL}/${id}/timer`, { sisa_detik });
    return response.data.data;
};