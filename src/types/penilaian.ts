//{*/types/penilaian.ts*}
export type JenisPenilaian =
    | "PUKULAN"
    | "TENDANGAN"
    | "JATUHAN"
    | "TEGURAN1"
    | "TEGURAN2"
    | "PERINGATAN1"
    | "PERINGATAN2";

// samain dengan POINT di penilaianModel.js
export const POINT: Record<JenisPenilaian, number> = {
    PUKULAN: 1,
    TENDANGAN: 2,
    JATUHAN: 3,
    TEGURAN1: -1,
    TEGURAN2: -2,
    PERINGATAN1: -5,
    PERINGATAN2: -10,
};

export interface PenilaianHistoryItem {
    id: number;
    jenis: JenisPenilaian;
    poin: number;
    keterangan: string | null;
    created_at: string;
    juri_id: number;
    juri: string;
    peserta_id: number;
    peserta: string;
}

export interface CreatePenilaianRequest {
    pertandingan_id: number;
    peserta_id: number;
    jenis: JenisPenilaian;
    keterangan?: string;
}

// TODO: sesuaikan dengan bentuk asli scoreboardModel.js
// (aku belum lihat file itu, jadi ini masih tebakan berdasarkan nama fungsi)
export interface ScoreboardJuriDetail {
    id: number;
    nama: string;
    total: number;
}

export interface ScoreboardPeserta {
    id: number;
    nama: string;
    regional: string;
    total: number;
    juri: ScoreboardJuriDetail[];
}

export interface Scoreboard {
    id: number;
    babak: string;
    status: string;
    winner_id: number | null;
    peserta1: ScoreboardPeserta;
    peserta2: ScoreboardPeserta;
}

export interface ScorePerJuri {
    juri_id: number;
    full_name: string;
    peserta_id: number;
    total: string;
}