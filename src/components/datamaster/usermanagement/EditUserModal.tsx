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
  Tooltip,
  CircularProgress
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUser, updateUser } from "../../../api/datamaster/user/UserManagement";
import Sidebar from "../../bar/Sidebar";
import UserMenu from "../../header/UserMenu";
import { useStore } from "../../../hooks/useStore";

export default function EdituserModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sidebarOpen, pageTitle, setPageTitle } = useStore();
  const drawerWidth = sidebarOpen ? 260 : 70;

  const [showPassword, setShowPassword] = useState(false);
  const [full_name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setPageTitle("Edit User");
    const loaduser = async () => {
      try {
        const data = await fetchUser();
        const found = data.find((d) => d.id === Number(id));
        if (found) {
          setName(found.full_name);
          setUsername(found.username);
          setEmail(found.email);
          setPassword(found.password);
          setRole(found.role);
        } else {
          navigate("/datamaster/usermanagement");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loaduser();
  }, [id, navigate, setPageTitle]);

  useEffect(() => {
    document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
  }, [pageTitle]);

  const handleSave = async () => {
    try {

      const payload: any = {
        full_name,
        username,
        email,
        role
      };

      if (password.trim() !== "") {
        payload.password = password;
      }

      await updateUser(Number(id), payload);

      setOpenDialog(true);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/datamaster/usermanagement");
  };

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
                <Typography variant="body1" color="error" sx={{ mr: 17.7 }}>
                  *
                </Typography>
                <TextField
                  value={full_name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  username
                </Typography>
                <Typography variant="body1" color="error" sx={{ mr: 14.2 }}>
                  *
                </Typography>
                <TextField
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  fullWidth
                  margin="normal"
                />
              </Box >
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Email
                </Typography>
                <Typography variant="body1" color="error" sx={{ mr: 18.2 }}>
                  *
                </Typography>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Password
                </Typography>
                <Typography variant="body1" color="error" sx={{ mr: 14.4 }}>
                  *
                </Typography>
                <TextField
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Role
                </Typography>
                <Typography variant="body1" color="error" sx={{ mr: 19.2 }}>
                  *
                </Typography>

                <TextField
                  select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  {/* <MenuItem value="developer">Developer</MenuItem> */}
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="panitia">Panitia</MenuItem>
                  <MenuItem value="juri">Juri</MenuItem>
                </TextField>
              </Box>
              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="error" onClick={handleSave} aria-label="Save user">
                  Submit
                </Button>
                <Button variant="contained" color="warning" onClick={() => navigate(-1)} aria-label="Back">
                  Back
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: 360, minHeight: 300 } }}>
          <DialogContent>
            <DialogTitle>
              <Box display="flex" flexDirection="column" alignItems="center">
                <CheckCircleIcon sx={{ color: "green", fontSize: 100, my: 2 }} />
                <Typography variant="h6">Success</Typography>
              </Box>
            </DialogTitle>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              User updated successfully!
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
