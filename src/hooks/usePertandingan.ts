//{*/hooks/usePertandingan.ts*}
import { useCallback, useEffect, useState } from "react";
import {
    fetchPertandingan,
    deletePertandingan as deletePertandinganApi,
} from "../api/turnament/pertandingan/pertandingan";
import { usePertandinganStore } from "../stores/pertandinganStore";

export const usePertandingan = (babak?: string) => {
    const { pertandingan, setPertandingan } = usePertandinganStore();
    const [loading, setLoading] = useState(false);

    const loadPertandingan = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchPertandingan(babak);
            setPertandingan(data);
        } finally {
            setLoading(false);
        }
    }, [babak]);

    const removePertandingan = async (id: number) => {
        try {
            setLoading(true);
            await deletePertandinganApi(id);
            await loadPertandingan();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPertandingan();
    }, [loadPertandingan]);

    return {
        pertandingan,
        loading,
        reload: loadPertandingan,
        removePertandingan,
    };
};