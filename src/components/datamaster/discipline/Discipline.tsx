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
    Divider
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import DeleteDisciplineDialog from "./DeleteDisciplineDialog";
import { useStore } from "../../../hooks/useStore";
import { useDisciplineStore } from "../../../stores/disciplineStore";
import { useDiscipline } from "../../../hooks/useDiscipline";

export default function Discipline() {
    const navigate = useNavigate();
    const { sidebarOpen, setPageTitle } = useStore();
    const { disciplines, loading, selectedDiscipline, setSelectedDiscipline } = useDisciplineStore();
    const { loadDisciplines, removeDiscipline } = useDiscipline();
    const drawerWidth = sidebarOpen ? 240 : 70;
    const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
        loadDisciplines();
        setPageTitle("Discipline");
    }, []);

    const memoizedDisciplines = useMemo(
        () => Array.isArray(disciplines) ? disciplines : [],
        [disciplines]
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress role="progressbar" aria-label="Loading disciplines..." />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", height: "100vh", width: "100vw", overflowX: "hidden" }}>
            <Box sx={{
                flexGrow: 1, transition: "margin-left 0.3s", ml: `${drawerWidth}px`, padding: 5, fontFamily: "Roboto, sans-serif",
                background: "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)", color: "black",
            }}>
                <Sidebar />
            </Box>
            <Box
                flexGrow={1}
                ml={`${drawerWidth}px`}
                padding={5}
                fontFamily="Roboto, sans-serif"
                bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)"
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        Discipline
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Fullscreen">
                            <IconButton size="medium" aria-label="Toggle fullscreen view">
                                <FullscreenIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>
                <Divider />
                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <TableContainer>
                            <Table aria-label="Discipline List Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Discipline</TableCell>
                                        <TableCell>Abbreviation</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {memoizedDisciplines.map((discipline, index) => (
                                        <TableRow key={discipline.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{discipline.discipline}</TableCell>
                                            <TableCell>{discipline.abbreviation}</TableCell>
                                            <TableCell>{discipline.gender}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    aria-label={`Edit ${discipline.discipline}`}
                                                    onClick={() => navigate(`/datamaster/discipline/discipline/edit/${discipline.id}`)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    aria-label={`Delete ${discipline.discipline}`}
                                                    onClick={() => {
                                                        setSelectedDiscipline(discipline);
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

                        <Box display="flex" justifyContent="flex-end" mt={5} mb={2}>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Add />}
                                onClick={() => navigate("/datamaster/discipline/discipline/create-discipline")}
                                aria-label="Create New Discipline"
                            >
                                Create
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                {selectedDiscipline && (
                    <DeleteDisciplineDialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        onConfirm={() => {
                            removeDiscipline(selectedDiscipline.id);
                            setOpenDelete(false);
                        }}
                        disciplineName={selectedDiscipline.discipline}
                    />
                )}
            </Box>
        </Box>
    );
}
