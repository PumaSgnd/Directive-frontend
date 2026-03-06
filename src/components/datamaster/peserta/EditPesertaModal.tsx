import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  MenuItem,
  CircularProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPeserta, updatePeserta } from "../../../api/datamaster/peserta/peserta";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";

export default function EditPesertaModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sidebarOpen, pageTitle, setPageTitle } = useStore();
  const drawerWidth = sidebarOpen ? 260 : 70;

  const [name, setName] = useState("");
  const [regional, setRegional] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setPageTitle("Edit Peserta");
    const loadPeserta = async () => {
      try {
        const data = await fetchPeserta();
        const found = data.find((d) => d.id === Number(id));
        if (found) {
          setName(found.name);
          setRegional(found.regional);
        } else {
          navigate("/datamaster/peserta");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadPeserta();
  }, [id, navigate, setPageTitle]);

  useEffect(() => {
    document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
  }, [pageTitle]);

  const handleSave = async () => {
    setErrors(fieldErrors);
    if (fieldErrors.name || fieldErrors.regional) {
      return;
    }

    setLoading(true);
    try {
      await updatePeserta(Number(id), { name, regional });
      setOpenDialog(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/datamaster/peserta");
  };

  const [errors, setErrors] = useState({ name: "", regional: "" });

  const fieldErrors = useMemo(
    () => ({
      name: name ? "" : "Peserta is required.",
      regional: regional ? "" : "regional is required.",
    }),
    [name, regional]
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bgcolor="rgba(255,255,255,0.7)"
        zIndex={9999}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
      <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
        <Sidebar />
      </Box>
      <Box flexGrow={1} ml={`${drawerWidth}px`} padding={3} fontFamily="Roboto, sans-serif" bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)">
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
              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="error" onClick={handleSave} aria-label="Save Peserta">
                  Submit
                </Button>
                <Button variant="contained" color="warning" onClick={() => navigate(-1)} aria-label="Back">
                  Back
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="success-dialog-title" sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: 360, minHeight: 300 } }}>
          <DialogContent>
            <DialogTitle>
              <Box display="flex" flexDirection="column" alignItems="center">
                <CheckCircleIcon sx={{ color: "green", fontSize: 100, my: 2 }} />
                <Typography variant="h6">Success</Typography>
              </Box>
            </DialogTitle>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Peserta updated successfully!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary" aria-label="Close dialog">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
