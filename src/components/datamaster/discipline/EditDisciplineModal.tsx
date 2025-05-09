import { useEffect, useState } from "react";
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
  Tooltip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDisciplines, updateDiscipline } from "../../../api/datamaster/discipline/discipline";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";

export default function EditDisciplineModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sidebarOpen, toggleSidebar, setPageTitle } = useStore();
  const drawerWidth = sidebarOpen ? 240 : 70;

  const [discipline, setDiscipline] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setPageTitle("Edit Discipline");
    const loadDiscipline = async () => {
      try {
        const data = await fetchDisciplines();
        const found = data.find((d) => d.id === Number(id));
        if (found) {
          setDiscipline(found.discipline);
          setAbbreviation(found.abbreviation);
          setGender(found.gender);
        } else {
          navigate("/datamaster/discipline/discipline");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadDiscipline();
  }, [id, navigate, setPageTitle]);

  const handleSave = async () => {
    try {
      await updateDiscipline(Number(id), { discipline, abbreviation, gender });
      setOpenDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/datamaster/discipline/discipline");
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100vh", width: "100vw", overflowX: "hidden" }}>
      <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
        <Sidebar />
      </Box>
      <Box flexGrow={1} ml={`${drawerWidth}px`} padding={5} fontFamily="Roboto, sans-serif" bgcolor="linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h2" fontWeight={600} fontSize={26}>
            Edit Discipline
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
              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="error" onClick={handleSave} aria-label="Save discipline">
                  Submit
                </Button>
                <Button variant="contained" color="warning" onClick={() => navigate(-1)} aria-label="Back">
                  Back
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogContent>
            <DialogTitle>
              <Box display="flex" flexDirection="column" alignItems="center">
                <CheckCircleIcon sx={{ color: "green", fontSize: 100, my: 2 }} />
                <Typography variant="h6">Success</Typography>
              </Box>
            </DialogTitle>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Discipline updated successfully!
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
