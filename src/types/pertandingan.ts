//{*/types/pertandingan.ts*}
export interface JuriPertandingan {
    id: number;
    full_name: string;
}

export interface Pertandingan {
    id: number;
    babak: "penyisihan" | "perempat_final" | "semi_final" | "final";
    status: "belum_mulai" | "berlangsung" | "pause" | "selesai";
    durasi_menit: number;
    sisa_detik: number | null;
    winner_id: number | null;
    waktu_mulai: string | null;
    waktu_selesai: string | null;

    peserta1_id: number;
    peserta1_name: string;
    peserta1_weight?: number;
    peserta1_regional?: string;

    peserta2_id: number | null;
    peserta2_name: string | null;
    peserta2_weight?: number;
    peserta2_regional?: string;

    juri: JuriPertandingan[];
}

export interface CreatePertandinganRequest {
    babak: string;
    durasi_menit: number;
    peserta1_id: number;
    peserta2_id: number;
}