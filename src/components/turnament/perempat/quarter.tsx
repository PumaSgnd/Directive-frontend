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
    TablePagination
} from "@mui/material";

import { Add, Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeletePesertaDialog from "./DeleteQuarterDialog";

import { useStore } from "../../../hooks/useStore";
import { usePertandinganStore } from "../../../stores/pertandinganStore";
import { usePertandingan } from "../../../hooks/usePertandingan";

import PaginationActions from "../../custom/PaginationActions";
import { useTranslation } from "react-i18next";

export default function Quarter() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();

    const {
        pertandingan,
        selectedPertandingan,
        setSelectedPertandingan,
    } = usePertandinganStore();

    const { reload, loading, deletePertandingan } = usePertandingan("perempat_final");

    const drawerWidth = sidebarOpen ? 260 : 70;
    const { t } = useTranslation();

    const [openDelete, setOpenDelete] = useState(false);
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
        setPageTitle(t("perempat"));
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
            data = data.filter((item) =>
                item.peserta1_name.toLowerCase().includes(search.toLowerCase()) ||
                item.peserta2_name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortBy === "no") {
            data.sort((a, b) =>
                sortOrder === "asc" ? a.id - b.id : b.id - a.id
            );
        }

        if (sortBy === "name") {
            data.sort((a, b) => {
                const nameA = `${a.peserta1_name} ${a.peserta2_name}`;
                const nameB = `${b.peserta1_name} ${b.peserta2_name}`;

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

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
                                        <TableRow key={match.id}>
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
                                                        }}
                                                    >
                                                        {t("vs")}
                                                    </Typography>

                                                    {formatText(match.peserta2_name)}
                                                </Box>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color:
                                                            match.status === "belum_mulai"
                                                                ? "text.secondary"
                                                                : match.status === "berlangsung"
                                                                    ? "warning.main"
                                                                    : "success.main",
                                                    }}
                                                >
                                                    {formatText(t(match.status))}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        navigate(`/pertandingan/edit/${match.id}`)
                                                    }
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
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
                                onPageChange={(_e, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                ActionsComponent={PaginationActions}
                            />

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Add />}
                                onClick={() => navigate("/pertandingan/perempat-final/create-perempat-final")}
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
                            await deletePertandingan(selectedPertandingan.id);
                            await reload();
                            setOpenDelete(false);
                            setSelectedPertandingan(null);
                        }}
                        PesertaName={`${selectedPertandingan.peserta1_name} vs ${selectedPertandingan.peserta2_name}`}
                    />
                )}
            </Box>
        </Box>
    );
}
