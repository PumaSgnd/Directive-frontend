import { useState, useMemo } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";
import { createDiscipline } from "../../../api/datamaster/discipline/discipline";

export default function CreateDisciplineModal() {
    const navigate = useNavigate();
    const { sidebarOpen, setPageTitle } = useStore();
    const drawerWidth = sidebarOpen ? 240 : 70;

    const [discipline, setDiscipline] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const [errors, setErrors] = useState({ discipline: "", abbreviation: "", gender: "" });

    useState(() => {
        setPageTitle("Create Discipline");
    });

    const fieldErrors = useMemo(
        () => ({
            discipline: discipline ? "" : "Discipline is required.",
            abbreviation: abbreviation ? "" : "Abbreviation is required.",
            gender: gender ? "" : "Gender is required."
        }),
        [discipline, abbreviation, gender]
    );

    const handleSubmit = async () => {
        setErrors(fieldErrors);
        if (fieldErrors.discipline || fieldErrors.abbreviation || fieldErrors.gender) {
            return;
        }

        setLoading(true);
        try {
            await createDiscipline({ discipline, abbreviation, gender });
            setDialogMessage("Discipline created successfully.");
            setOpenDialog(true);
            setTimeout(() => {
                navigate("/datamaster/discipline/discipline");
            }, 2000);
        } catch (error) {
            console.error(error);
            setDialogMessage("Error creating discipline.");
            setOpenDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogMessage("");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", height: "100vh", width: "100vw", overflowX: "hidden" }}>
            <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
                <Sidebar />
            </Box>
            <Box flexGrow={1} ml={`${drawerWidth}px`} padding={5} bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)" fontFamily="Roboto, sans-serif">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        Create Discipline
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Fullscreen">
                            <IconButton aria-label="Toggle fullscreen" size="medium">
                                <FullscreenIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>
                <Divider />
                <Card sx={{ mt: 4, borderRadius: 3 }}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" gap={2} mt={2} ml={4} mr={4}>
                            <Typography variant="body2" color="error" mb={2}>
                                Note: (<span style={{ color: "red" }}>*</span>) Required fields
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                    Discipline
                                </Typography>
                                <Typography variant="body1" color="error" sx={{ mr: 20 }}>
                                    *
                                </Typography>
                                <TextField
                                    value={discipline}
                                    onChange={(e) => setDiscipline(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                    Abbreviation
                                </Typography>
                                <Typography variant="body1" color="error" sx={{ mr: 17.4 }}>
                                    *
                                </Typography>
                                <TextField
                                    value={abbreviation}
                                    onChange={(e) => setAbbreviation(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </Box >
                            <Box display="flex" alignItems="center">
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                    Gender
                                </Typography>
                                <Typography variant="body1" color="error" sx={{ mr: 22 }}>
                                    *
                                </Typography>
                                <TextField
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </Box>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                <Button variant="contained" color="error" onClick={handleSubmit} aria-label="Submit Discipline">
                                    {loading ? "Submitting..." : "Submit"}
                                </Button>
                                <Button variant="contained" color="warning" onClick={() => navigate("/datamaster/discipline/discipline")} aria-label="Back to Discipline List">
                                    Back
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                <Dialog open={openDialog} onClose={handleCloseDialog} role="dialog" aria-labelledby="success-dialog-title">
                    <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <CheckCircleIcon sx={{ color: "green", fontSize: 100, my: 2 }} />
                        <DialogTitle id="success-dialog-title" sx={{ fontWeight: "bold" }}>
                            Success
                        </DialogTitle>
                        <Typography variant="body1" sx={{ fontSize: 14, textAlign: "center" }}>
                            {dialogMessage}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary" aria-label="Close success dialog">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
