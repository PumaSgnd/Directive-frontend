import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Alert
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { useAuthStore } from "../../stores/authStore";

import {
    fetchPertandinganById,
    startPertandingan,
    pausePertandingan,
    resumePertandingan,
    finishPertandingan
} from "../../api/turnament/pertandingan/pertandingan";

import {
    createPenilaian,
    undoPenilaian,
    fetchScoreboard,
    fetchScorePerJuri
} from "../../api/turnament/penilaian/penilaian";

import { JenisPenilaian } from "../../types/penilaian";
import { Pertandingan } from "../../types/pertandingan";
import { Scoreboard, ScorePerJuri } from "../../types/penilaian";

const PLUS_JENIS: { label: string; jenis: JenisPenilaian }[] = [
    { label: "1", jenis: "PUKULAN" },
    { label: "2", jenis: "TENDANGAN" },
    { label: "3", jenis: "JATUHAN" },
];

const MINUS_JENIS: { label: string; jenis: JenisPenilaian }[] = [
    { label: "-1", jenis: "TEGURAN1" },
    { label: "-2", jenis: "TEGURAN2" },
    { label: "-5", jenis: "PERINGATAN1" },
    { label: "-10", jenis: "PERINGATAN2" },
];

const POLL_INTERVAL_MS = 3000;

/**
 * Ambil pesan error dengan aman tanpa memakai tipe `any`.
 */
const getErrorMessage = (err: unknown, fallback: string): string => {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return data?.message ?? fallback;
    }
    if (err instanceof Error) {
        return err.message || fallback;
    }
    return fallback;
};

export default function HitungTurnamen() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const pertandinganId = id ? Number(id) : null;

    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const drawerWidth = sidebarOpen ? 260 : 30;

    const [pertandingan, setPertandingan] = useState<Pertandingan | null>(null);
    const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null);
    const [scorePerJuri, setScorePerJuri] = useState<ScorePerJuri[]>([]);

    const [sisaDetik, setSisaDetik] = useState<number | null>(null);

    // -----------------------------------------------------------------
    // Nilai turunan dari `pertandingan`. Sengaja diletakkan di atas,
    // SEBELUM semua handler di bawah memakainya (const tidak di-hoist).
    // -----------------------------------------------------------------
    const { user } = useAuthStore();
    const myJuriId = user?.id;

    // Skor milik juri yang SEDANG LOGIN saja — bukan total gabungan semua juri.
    const myScorePeserta1 =
        scoreboard?.peserta1.juri.find((j) => j.id === myJuriId)?.total ?? 0;

    const myScorePeserta2 =
        scoreboard?.peserta2.juri.find((j) => j.id === myJuriId)?.total ?? 0;
    const daftarJuri = pertandingan?.juri ?? [];
    const hasMatch = !!pertandinganId;
    const status = pertandingan?.status;
    const disabledInput = !hasMatch || status !== "berlangsung";

    const [submitting, setSubmitting] = useState(false);
    const [controlLoading, setControlLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const controllerRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // ================= FULLSCREEN =================
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (controllerRef.current?.requestFullscreen) {
                controllerRef.current.requestFullscreen();
            } else if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleChange);
        };
    }, []);

    // ================= TITLE =================
    useEffect(() => {
        setPageTitle("Hitung Turnamen");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
    }, [pageTitle]);

    const lastStatusRef = useRef<string | undefined>(undefined);

    // ================= FETCH DATA (poll berkala) =================
    const loadData = useCallback(async () => {
        if (!pertandinganId) return;

        try {
            const [detail, board, perJuri] = await Promise.all([
                fetchPertandinganById(pertandinganId),
                fetchScoreboard(pertandinganId),
                fetchScorePerJuri(pertandinganId),
            ]);

            setPertandingan(detail);
            setScoreboard(board ?? null);
            setScorePerJuri(perJuri);

            const statusBerubah = lastStatusRef.current !== detail.status;
            lastStatusRef.current = detail.status;

            if (detail.status !== "berlangsung" || statusBerubah) {
                setSisaDetik(detail.sisa_detik);
            }

            setError(null);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data pertandingan.");
        }
    }, [pertandinganId]);

    useEffect(() => {
        if (!pertandinganId) return;

        loadData();
        const interval = setInterval(loadData, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [loadData, pertandinganId]);

    // ================= COUNTDOWN LOKAL =================
    useEffect(() => {
        if (status !== "berlangsung") return;
        if (sisaDetik === null || sisaDetik <= 0) return;

        const timeout = setTimeout(() => {
            setSisaDetik((prev) => (prev !== null ? Math.max(prev - 1, 0) : prev));
        }, 1000);

        return () => clearTimeout(timeout);
    }, [sisaDetik, status]);

    const formatTime = (detik: number | null) => {
        if (detik === null) return "--:--";
        const m = Math.floor(detik / 60);
        const s = detik % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // ================= HANDLER SKOR =================
    const handleScore = async (side: "left" | "right", jenis: JenisPenilaian) => {
        if (!pertandingan || !pertandinganId) return;

        const pesertaId = side === "left"
            ? pertandingan.peserta1_id
            : pertandingan.peserta2_id;

        if (!pesertaId) {
            setError("Peserta belum lengkap.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await createPenilaian({
                pertandingan_id: pertandinganId,
                peserta_id: pesertaId,
                jenis,
            });
            await loadData();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Gagal menyimpan penilaian."));
        } finally {
            setSubmitting(false);
        }
    };

    // ================= UNDO =================
    const handleUndo = async () => {
        if (!pertandinganId) return;

        setSubmitting(true);
        setError(null);

        try {
            await undoPenilaian(pertandinganId);
            await loadData();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Gagal undo penilaian."));
        } finally {
            setSubmitting(false);
        }
    };

    // ================= KONTROL PERTANDINGAN =================
    const handleStart = async () => {
        if (!pertandinganId) return;
        setControlLoading(true);
        setError(null);

        try {
            await startPertandingan(pertandinganId);
            await loadData();
        } catch {
            // Kemungkinan besar juri lain sudah start duluan — sinkronkan
            // saja tanpa menakut-nakuti user dengan pesan error.
            await loadData();
        } finally {
            setControlLoading(false);
        }
    };

    const handlePause = async () => {
        if (!pertandinganId || sisaDetik === null) return;
        setControlLoading(true);
        setError(null);

        try {
            await pausePertandingan(pertandinganId, sisaDetik);
            await loadData();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Gagal pause pertandingan."));
        } finally {
            setControlLoading(false);
        }
    };

    const handleResume = async () => {
        if (!pertandinganId) return;
        setControlLoading(true);
        setError(null);

        try {
            await resumePertandingan(pertandinganId);
            await loadData();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Gagal melanjutkan pertandingan."));
        } finally {
            setControlLoading(false);
        }
    };

    const handleFinish = async () => {
        if (!pertandinganId) return;
        setControlLoading(true);
        setError(null);

        try {
            await finishPertandingan(pertandinganId);
            await loadData();
        } catch (err: unknown) {
            setError(
                getErrorMessage(
                    err,
                    "Gagal menyelesaikan pertandingan (mungkin skor masih seri)."
                )
            );
        } finally {
            setControlLoading(false);
        }
    };

    // ================= TOGGLE PLAY/PAUSE =================
    const handleToggleTimer = () => {
        if (status === "belum_mulai") {
            handleStart();
        } else if (status === "berlangsung") {
            handlePause();
        } else if (status === "pause") {
            handleResume();
        }
    };

    const timerDisplay =
        status === "belum_mulai"
            ? formatTime((pertandingan?.durasi_menit ?? 0) * 60)
            : formatTime(sisaDetik);

    // ================= HELPER: skor per juri per peserta =================
    const getJuriScore = (juriId: number, pesertaId: number | null) => {
        if (!pesertaId) return 0;
        const found = scorePerJuri.find(
            (s) => s.juri_id === juriId && s.peserta_id === pesertaId
        );
        return found ? Number(found.total) : 0;
    };

    // ================= RENDER =================
    return (
        <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
            <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
                <Sidebar />
            </Box>
            <Box
                flexGrow={1}
                ml={`${drawerWidth}px`}
                padding={3}
                fontFamily="Roboto, sans-serif"
                bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)"
                sx={{ display: "flex", flexDirection: "column" }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        {pageTitle}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Fullscreen">
                            <IconButton size="medium" aria-label="Toggle fullscreen view" onClick={toggleFullscreen}>
                                {isFullscreen ? <FullscreenExitIcon fontSize="medium" /> : <FullscreenIcon fontSize="medium" />}
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>
                <Divider />

                {!hasMatch ? (
                    <Card sx={{ mt: 5, flexGrow: 1 }}>
                        <CardContent>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                gap={2}
                                py={8}
                            >
                                <Typography variant="h6" color="text.secondary">
                                    Belum ada pertandingan yang dipilih
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Buka halaman Data Pertandingan, lalu pilih salah satu
                                    pertandingan untuk mulai menghitung skor.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate("/pertandingan/penyisihan")}
                                >
                                    Ke Data Pertandingan
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {status === "belum_mulai" && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Pertandingan belum dimulai. Tekan tombol Play untuk memulai.
                            </Alert>
                        )}

                        {status === "pause" && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                Pertandingan sedang di-pause.
                            </Alert>
                        )}

                        {status === "selesai" && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Pertandingan sudah selesai. Input skor dinonaktifkan.
                            </Alert>
                        )}

                        <Card ref={controllerRef} sx={{ mt: 5, flexGrow: 1 }}>
                            <CardContent>
                                {/* TOTAL SKOR */}
                                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                                    <Box display="flex" gap={2}>
                                        <Box flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2} textAlign="center">
                                            <Typography>{pertandingan?.peserta1_name ?? "Peserta 1"}</Typography>
                                            <Typography fontSize={32} fontWeight="bold">
                                                {scoreboard?.peserta1.total ?? 0}
                                            </Typography>
                                        </Box>
                                        <Box flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2} textAlign="center">
                                            <Typography>{pertandingan?.peserta2_name ?? "Peserta 2"}</Typography>
                                            <Typography fontSize={32} fontWeight="bold">
                                                {scoreboard?.peserta2.total ?? 0}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box display="flex" gap={2}>
                                        {daftarJuri.length === 0 && (
                                            <Typography variant="body2" color="text.secondary">
                                                Belum ada juri ditunjuk untuk pertandingan ini.
                                            </Typography>
                                        )}
                                        {daftarJuri.map((j, idx) => (
                                            <Box key={j.id} flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2}>
                                                <Typography textAlign="center" mb={1}>
                                                    {j.full_name || `Juri ${idx + 1}`}
                                                </Typography>
                                                <Box display="flex" justifyContent="center" gap={2}>
                                                    <Typography fontSize={28} fontWeight="bold">
                                                        {getJuriScore(j.id, pertandingan?.peserta1_id ?? null)}
                                                    </Typography>
                                                    <Typography fontSize={28} fontWeight="bold">
                                                        {getJuriScore(j.id, pertandingan?.peserta2_id ?? null)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* CONTROLLER */}
                                <Box bgcolor="black" p={2} borderRadius={2} ml={2}>

                                    {/* + BUTTON */}
                                    <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gap={1} mb={1}>
                                        {PLUS_JENIS.map(({ label, jenis }) => (
                                            <Button
                                                key={`left-${jenis}`}
                                                disabled={disabledInput || submitting}
                                                onClick={() => handleScore("left", jenis)}
                                                sx={{ bgcolor: "#f44336", color: "#fff", fontSize: 20 }}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                        {PLUS_JENIS.map(({ label, jenis }) => (
                                            <Button
                                                key={`right-${jenis}`}
                                                disabled={disabledInput || submitting}
                                                onClick={() => handleScore("right", jenis)}
                                                sx={{ bgcolor: "#2196f3", color: "#fff", fontSize: 20 }}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </Box>

                                    {/* - BUTTON */}
                                    <Box display="grid" gridTemplateColumns="repeat(8, 1fr)" gap={1} mb={2}>
                                        {MINUS_JENIS.map(({ label, jenis }) => (
                                            <Button
                                                key={`left-${jenis}`}
                                                disabled={disabledInput || submitting}
                                                onClick={() => handleScore("left", jenis)}
                                                sx={{ bgcolor: "#ef5350", color: "#fff" }}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                        {MINUS_JENIS.map(({ label, jenis }) => (
                                            <Button
                                                key={`right-${jenis}`}
                                                disabled={disabledInput || submitting}
                                                onClick={() => handleScore("right", jenis)}
                                                sx={{ bgcolor: "#42a5f5", color: "#fff" }}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </Box>

                                    {/* BOTTOM */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>

                                        {/* LEFT — X = undo input terakhir juri ini */}
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Tooltip title="Undo input terakhir milik juri ini">
                                                <span>
                                                    <Button
                                                        onClick={handleUndo}
                                                        disabled={submitting || status !== "berlangsung"}
                                                        sx={{ bgcolor: "red", color: "#fff" }}
                                                    >
                                                        X
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                            <Box sx={{
                                                border: "2px solid red",
                                                color: "#fff",
                                                px: 4, py: 1,
                                                fontSize: 20,
                                                borderRadius: 1
                                            }}>
                                                {myScorePeserta1 ?? 0}
                                            </Box>
                                        </Box>

                                        {/* CENTER — Toggle Play/Pause + Finish */}
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {status !== "selesai" ? (
                                                <Button
                                                    onClick={handleToggleTimer}
                                                    disabled={controlLoading}
                                                    startIcon={status === "berlangsung" ? <PauseIcon /> : <PlayArrowIcon />}
                                                    sx={{
                                                        bgcolor: status === "berlangsung" ? "orange" : "green",
                                                        color: "#fff",
                                                        px: 4,
                                                        fontSize: 18,
                                                        minWidth: 130
                                                    }}
                                                >
                                                    {timerDisplay}
                                                </Button>
                                            ) : (
                                                <Button
                                                    disabled
                                                    sx={{ bgcolor: "grey.700", color: "#fff", px: 4, fontSize: 18 }}
                                                >
                                                    Selesai
                                                </Button>
                                            )}

                                            {(status === "berlangsung" || status === "pause") && (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={handleFinish}
                                                    disabled={controlLoading}
                                                    sx={{ minWidth: 100 }}
                                                >
                                                    Selesaikan
                                                </Button>
                                            )}
                                        </Box>

                                        {/* RIGHT — X = undo input terakhir juri ini */}
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{
                                                border: "2px solid #2196f3",
                                                color: "#fff",
                                                px: 4, py: 1,
                                                fontSize: 20,
                                                borderRadius: 1
                                            }}>
                                                {myScorePeserta2 ?? 0}
                                            </Box>
                                            <Tooltip title="Undo input terakhir milik juri ini">
                                                <span>
                                                    <Button
                                                        onClick={handleUndo}
                                                        disabled={submitting || status !== "berlangsung"}
                                                        sx={{ bgcolor: "#2196f3", color: "#fff" }}
                                                    >
                                                        X
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </Box>

                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Box>
        </Box>
    );
}