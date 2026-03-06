import { useState, useMemo, useEffect } from "react";
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
    Tooltip,
    MenuItem
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";
import { createPeserta } from "../../../api/datamaster/peserta/peserta";

export default function CreatePesertaModal() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const drawerWidth = sidebarOpen ? 260 : 70;

    const [name, setName] = useState("");
    const [regional, setRegional] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const [errors, setErrors] = useState({ name: "", regional: "" });

    useEffect(() => {
        setPageTitle("Create Peserta");
    }, []);

    useEffect(() => {
        document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
    }, [pageTitle]);

    const fieldErrors = useMemo(
        () => ({
            name: name ? "" : "Peserta is required.",
            regional: regional ? "" : "regional is required.",
        }),
        [name, regional]
    );

    const handleSubmit = async () => {
        setErrors(fieldErrors);
        if (fieldErrors.name || fieldErrors.regional) {
            return;
        }

        setLoading(true);
        try {
            await createPeserta({ name, regional });
            setDialogMessage("Peserta created successfully.");
            setOpenDialog(true);
            setTimeout(() => {
                navigate("/datamaster/peserta");
            }, 2000);
        } catch (error) {
            console.error(error);
            setDialogMessage("Error creating Peserta.");
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
        <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
            <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
                <Sidebar />
            </Box>
            <Box flexGrow={1} ml={`${drawerWidth}px`} padding={3} bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)" fontFamily="Roboto, sans-serif">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        {pageTitle}
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
                                    Name
                                </Typography>
                                <Typography variant="body1" color="error" sx={{ mr: 17.4 }}>
                                    *
                                </Typography>
                                <TextField
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                    Regional
                                </Typography>
                                <Typography variant="body1" color="error" sx={{ mr: 14.7 }}>
                                    *
                                </Typography>
                                <TextField
                                    select
                                    value={regional}
                                    onChange={(e) => setRegional(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.regional}
                                    helperText={errors.regional}
                                >
                                    <MenuItem value="kota_bandung">Kota Bandung</MenuItem>
                                    <MenuItem value="kota_cimahi">Kota Cimahi</MenuItem>
                                    <MenuItem value="kabupaten_bandung">Kabupaten Bandung</MenuItem>
                                    <MenuItem value="kabupaten_bandung_barat">Kabupaten Bandung Barat</MenuItem>
                                    <MenuItem value="kabupaten_sumedang">Kabupaten Sumedang</MenuItem>
                                </TextField>
                            </Box >
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                <Button variant="contained" color="error" onClick={handleSubmit} aria-label="Submit Peserta">
                                    {loading ? "Submitting..." : "Submit"}
                                </Button>
                                <Button variant="contained" color="warning" onClick={() => navigate("/datamaster/peserta")} aria-label="Back to Peserta List">
                                    Back
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                <Dialog open={openDialog} onClose={handleCloseDialog} role="dialog" aria-labelledby="success-dialog-title" sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: 360, minHeight: 300 } }}>
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
