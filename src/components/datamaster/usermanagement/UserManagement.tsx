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
import DeleteUserDialog from "./DeleteUserDialog";
import { useStore } from "../../../hooks/useStore";
import { useUserStore } from "../../../stores/UserStore";
import { useUser } from "../../../hooks/useUser";

export default function UserManagement() {
    const navigate = useNavigate();
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const { User, loading, selectedUser, setSelectedUser } = useUserStore();
    const { loadUser, removeUser } = useUser();
    const drawerWidth = sidebarOpen ? 260 : 70;
    const [openDelete, setOpenDelete] = useState(false);

    const capitalizeWords = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());
    const formatEmail = (email: string) => {
        const [name, domain] = email.split("@");
        return `${capitalizeWords(name)}@${domain.toLowerCase()}`;
    };

    useEffect(() => {
        loadUser();
        setPageTitle("User Management");
    }, []);

    useEffect(() => {
        document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
    }, [pageTitle]);

    const memoizedUser = useMemo(
        () => Array.isArray(User) ? User : [],
        [User]
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress role="progressbar" aria-label="Loading User..." />
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
                            <Table aria-label="User List Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>User Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {memoizedUser.map((User, index) => (
                                        <TableRow key={User.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{User.full_name ? capitalizeWords(User.full_name) : "Unknown User"}</TableCell>
                                            <TableCell>{User.username ? capitalizeWords(User.username) : "Unknown User"}</TableCell>
                                            <TableCell>{User.email ? formatEmail(User.email) : "Unknown Email"}</TableCell>
                                            <TableCell>{User.role}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    aria-label={`Edit ${User.full_name}`}
                                                    onClick={() => navigate(`/datamaster/usermanagement/edit/${User.id}`)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    aria-label={`Delete ${User.full_name}`}
                                                    onClick={() => {
                                                        setSelectedUser(User);
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
                                onClick={() => navigate("/datamaster/usermanagement/create-user")}
                                aria-label="Create New User"
                            >
                                Create
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                {selectedUser && (
                    <DeleteUserDialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        onConfirm={() => {
                            removeUser(selectedUser.id);
                            setOpenDelete(false);
                        }}
                        UserName={selectedUser.full_name}
                    />
                )}
            </Box>
        </Box>
    );
}
