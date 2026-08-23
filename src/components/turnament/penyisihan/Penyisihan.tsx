import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Tooltip,
    Divider,
    TextField,
    MenuItem,
    TablePagination,
    Chip,
} from "@mui/material";

import { Add, Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeletePesertaDialog from "./DeletePenyisihanDialog";
import PertandinganDetailDialog from "./PertandinganDetailDialog";

import { useStore } from "../../../hooks/useStore";
import { usePertandinganStore } from "../../../stores/pertandinganStore";
import { usePertandingan } from "../../../hooks/usePertandingan";

import PaginationActions from "../../custom/PaginationActions";
import { useTranslation } from "react-i18next";

export default function Penyisihan() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();

    const {
        pertandingan,
        selectedPertandingan,
        setSelectedPertandingan,
    } = usePertandinganStore();

    const { loading, removePertandingan } = usePertandingan("penyisihan");

    const drawerWidth = sidebarOpen ? 260 : 70;
    const { t } = useTranslation();

    const [openDelete, setOpenDelete] = useState(false);

    // ===== DETAIL DIALOG =====
    // dipisah dari selectedPertandingan (yang dipakai untuk delete)
    // supaya klik row untuk lihat detail tidak bentrok state-nya
    // dengan alur hapus.
    const [detailId, setDetailId] = useState<number | null>(null);
    const [openDetail, setOpenDetail] = useState(false);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"default" | "no" | "name">("default");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    useEffect(() => {
        setPageTitle(t("penyisihan"));
    }, [setPageTitle, t]);

    useEffect(() => {
        document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
    }, [pageTitle]);

    const formatText = (text: string) => {
        if (!text) return "";
        return text
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const filteredMatches = useMemo(() => {
        let data = [...(pertandingan || [])];

        if (search) {
            const q = search.toLowerCase();
            data = data.filter((item) =>
                item.peserta1_name?.toLowerCase().includes(q) ||
                // peserta2_name bisa null untuk pertandingan BYE
                (item.peserta2_name ?? "").toLowerCase().includes(q)
            );
        }

        if (sortBy === "no") {
            data.sort((a, b) =>
                sortOrder === "asc" ? a.id - b.id : b.id - a.id
            );
        }

        if (sortBy === "name") {
            data.sort((a, b) => {
                const nameA = `${a.peserta1_name} ${a.peserta2_name ?? ""}`;
                const nameB = `${b.peserta1_name} ${b.peserta2_name ?? ""}`;

                return sortOrder === "asc"
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            });
        }

        return data;
    }, [pertandingan, search, sortBy, sortOrder]);

    const paginatedMatches = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredMatches.slice(start, start + rowsPerPage);
    }, [filteredMatches, page, rowsPerPage]);

    const handleOpenDetail = (id: number) => {
        setDetailId(id);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setDetailId(null);
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case "belum_mulai":
                return t("belum_mulai");
            case "berlangsung":
                return t("berlangsung");
            case "pause":
                return t("pause");
            case "selesai":
                return t("selesai");
            default:
                return t("semua");
        }
    };

    const getStatusColor = (
        status?: string
    ): "default" | "warning" | "success" | "info" => {
        switch (status) {
            case "berlangsung":
                return "warning";
            case "pause":
                return "info";
            case "selesai":
                return "success";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: drawerWidth,
                    height: "100vh",
                    zIndex: 1200,
                }}
            >
                <Sidebar />
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: `${drawerWidth}px`,
                    right: 0,
                    minHeight: "100vh",
                    boxSizing: "border-box",
                    p: 3,

                    fontFamily: "Roboto, sans-serif",
                    transition: "margin-left 0.3s, width 0.3s",
                    background:
                        "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
                    color: "black",

                    // HILANGKAN SCROLL X & Y
                    overflowX: "hidden",
                    overflowY: "hidden",
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        {pageTitle}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title={t("fullscreen")}>
                            <IconButton size="medium" aria-label="Toggle fullscreen view" onClick={toggleFullscreen}>
                                {isFullscreen ? (
                                    <FullscreenExitIcon fontSize="medium" />
                                ) : (
                                    <FullscreenIcon fontSize="medium" />
                                )}
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <TextField
                        select
                        size="small"
                        value={sortBy}
                        onChange={(e) => {
                            const value = e.target.value as "default" | "no" | "name";

                            if (value === sortBy) {
                                setSortOrder((prev) =>
                                    prev === "asc" ? "desc" : "asc"
                                );
                            } else {
                                setSortBy(value);
                                setSortOrder("asc");
                            }
                        }}
                    >
                        <MenuItem value="default">{t("filter")}</MenuItem>
                        <MenuItem value="no">{t("no")}</MenuItem>
                        <MenuItem value="name">{t("match")}</MenuItem>
                    </TextField>

                    <TextField
                        placeholder={t("search")}
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">{t("no")}</TableCell>
                                        <TableCell align="center">{t("match")}</TableCell>
                                        <TableCell align="center">{t("status")}</TableCell>
                                        <TableCell align="center">{t("actions")}</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedMatches.map((match, index) => (
                                        <TableRow
                                            key={match.id}
                                            hover
                                            onClick={() => handleOpenDetail(match.id)}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell align="center">
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>

                                            <TableCell align="center">
                                                <Box display="flex" justifyContent="center" gap={1}>
                                                    {formatText(match.peserta1_name)}

                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: "error.main",
                                                            fontSize: 12,
                                                            mt: 0.2,
                                                        }}
                                                    >
                                                        {t("vs")}
                                                    </Typography>

                                                    {match.peserta2_name
                                                        ? formatText(match.peserta2_name)
                                                        : t("bye")}
                                                </Box>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Chip
                                                    label={getStatusText(match.status)}
                                                    color={getStatusColor(match.status)}
                                                    size="medium"
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={(e) => {
                                                        // cegah klik tombol ikut membuka dialog detail
                                                        e.stopPropagation();
                                                        navigate(`/pertandingan/edit/${match.id}`);
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPertandingan(match);
                                                        setOpenDelete(true);
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* PAGINATION */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={5} mb={2}>
                            <TablePagination
                                component="div"
                                count={filteredMatches.length}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                                labelRowsPerPage={t("rows")}
                                ActionsComponent={PaginationActions}
                                sx={{
                                    "& .MuiTablePagination-select": {
                                        border: "1px solid #ccc",
                                    }
                                }}
                            />

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Add />}
                                onClick={() => navigate("/pertandingan/penyisihan/create-penyisihan")}
                            >
                                {t("create")}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {selectedPertandingan && (
                    <DeletePesertaDialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        onConfirm={async () => {
                            // removePertandingan sudah reload data secara internal,
                            // jadi tidak perlu panggil reload() lagi di sini.
                            await removePertandingan(selectedPertandingan.id);
                            setOpenDelete(false);
                            setSelectedPertandingan(null);
                        }}
                        PesertaName={`${selectedPertandingan.peserta1_name} vs ${selectedPertandingan.peserta2_name ?? t("bye")}`}
                    />
                )}

                <PertandinganDetailDialog
                    open={openDetail}
                    pertandinganId={detailId}
                    onClose={handleCloseDetail}
                />
            </Box>
        </Box>
    );
}