//{*/hooks/usePenilaian.ts*}
import { useCallback, useEffect, useState } from "react";
import {
    createPenilaian as createPenilaianApi,
    fetchHistoryPenilaian,
    fetchScoreboard,
    undoPenilaian as undoPenilaianApi,
    resetPenilaian as resetPenilaianApi,
} from "../api/turnament/penilaian/penilaian";
import { usePenilaianStore } from "../stores/penilaianStore";
import { JenisPenilaian } from "../types/penilaian";

export const usePenilaian = (pertandinganId: number) => {
    const { history, scoreboard, setHistory, setScoreboard } =
        usePenilaianStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const [historyData, scoreboardData] = await Promise.all([
                fetchHistoryPenilaian(pertandinganId),
                fetchScoreboard(pertandinganId),
            ]);
            setHistory(historyData);
            setScoreboard(scoreboardData);
            setError(null);
        } finally {
            setLoading(false);
        }
    }, [pertandinganId]);

    const submit = async (pesertaId: number, jenis: JenisPenilaian, keterangan?: string) => {
        try {
            setError(null);
            await createPenilaianApi({
                pertandingan_id: pertandinganId,
                peserta_id: pesertaId,
                jenis,
                keterangan,
            });
            await load();
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Gagal menyimpan penilaian.");
            throw err;
        }
    };

    const undo = async () => {
        try {
            setError(null);
            await undoPenilaianApi(pertandinganId);
            await load();
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Gagal undo penilaian.");
            throw err;
        }
    };

    const reset = async () => {
        await resetPenilaianApi(pertandinganId);
        await load();
    };

    useEffect(() => {
        load();
    }, [load]);

    return {
        history,
        scoreboard,
        loading,
        error,
        reload: load,
        submit,
        undo,
        reset,
    };
};