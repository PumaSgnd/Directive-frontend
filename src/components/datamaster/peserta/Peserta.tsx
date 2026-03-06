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
    MenuItem
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeletePesertaDialog from "./DeletePesertaDialog";
import { useStore } from "../../../hooks/useStore";
import { usePesertaStore } from "../../../stores/PesertaStore";
import { usePeserta } from "../../../hooks/usePeserta";
import PaginationActions from "../../custom/PaginationActions";

export default function Peserta() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const { Peserta, loading, selectedPeserta, setSelectedPeserta } = usePesertaStore();
    const { loadPeserta, removePeserta } = usePeserta();
    const drawerWidth = sidebarOpen ? 260 : 70;
    const [openDelete, setOpenDelete] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"default" | "no" | "name" | "regional">("default");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
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

    useEffect(() => {
        loadPeserta();
        setPageTitle("Peserta");
    }, []);

    useEffect(() => {
        document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
    }, [pageTitle]);

    const memoizedPeserta = useMemo(
        () => Array.isArray(Peserta) ? Peserta : [],
        [Peserta]
    );

    const filteredPeserta = useMemo(() => {
        let data = [...memoizedPeserta];

        if (search) {
            data = data.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortBy === "no") {
            data.sort((a, b) =>
                sortOrder === "asc" ? a.id - b.id : b.id - a.id
            );
        }

        if (sortBy === "name") {
            data.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.name.localeCompare(b.name);
                }
                return b.name.localeCompare(a.name);
            });
        }

        if (sortBy === "regional") {
            data.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.regional.localeCompare(b.regional);
                }
                return b.regional.localeCompare(a.regional);
            });
        }

        if (sortBy === "default") {
            return data;
        }

        return data;
    }, [memoizedPeserta, search, sortBy, sortOrder]);

    const paginatedPeserta = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredPeserta.slice(start, start + rowsPerPage);
    }, [filteredPeserta, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [search, sortBy, sortOrder]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress role="progressbar" aria-label="Loading Peserta..." />
            </Box>
        );
    }

    const formatText = (text: string) => {
        if (!text) return "";

        return text
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

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
                        <Tooltip title="Fullscreen">
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
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={5}
                >
                    <TextField
                        select
                        size="small"
                        value={sortBy}
                        onChange={(e) => {
                            const value = e.target.value as "default" | "no" | "name";

                            if (value === sortBy) {
                                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                            } else {
                                setSortBy(value);
                                setSortOrder("asc");
                            }
                        }}
                        sx={{ width: 150 }}
                    >
                        <MenuItem value="default">Filter</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="regional">Regional</MenuItem>
                    </TextField>
                    <TextField
                        placeholder="Search..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 250 }}
                    />
                </Box>
                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <TableContainer>
                            <Table aria-label="Peserta List Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Regional</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedPeserta.map((Peserta, index) => (
                                        <TableRow key={Peserta.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{formatText(Peserta.name)}</TableCell>
                                            <TableCell>{formatText(Peserta.regional)}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    aria-label={`Edit ${Peserta.name}`}
                                                    onClick={() => navigate(`/datamaster/peserta/edit/${Peserta.id}`)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    aria-label={`Delete ${Peserta.name}`}
                                                    onClick={() => {
                                                        setSelectedPeserta(Peserta);
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

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={5}
                            mb={2}
                        >
                            <TablePagination
                                component="div"
                                count={filteredPeserta.length}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                                labelRowsPerPage="Rows"
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
                                onClick={() => navigate("/datamaster/peserta/create-peserta")}
                                aria-label="Create New Peserta"
                            >
                                Create
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                {selectedPeserta && (
                    <DeletePesertaDialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        onConfirm={() => {
                            removePeserta(selectedPeserta.id);
                            setOpenDelete(false);
                        }}
                        PesertaName={selectedPeserta.name}
                    />
                )}
            </Box>
        </Box>
    );
}
