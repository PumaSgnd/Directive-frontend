import React from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import directiveLogo from "../assets/direc.png";
import backgroundImage from "../assets/background.jpg";

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Logic pengiriman email reset password
    };

    const handleCreateAccount = () => {
        navigate("/register");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                px: 91,
                py: 0,
            }}
        >
            <Box mb={2}>
                <img
                    src={directiveLogo}
                    alt="Directive Logo"
                    style={{ height: 60, cursor: "pointer" }}
                    onClick={() => window.location.reload()}
                />
            </Box>
            <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 5 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="start">
                    Reset Password
                </Typography>
                <Typography classes="p" fontWeight="regular" gutterBottom textAlign="start">
                    Email Address
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            borderRadius: 2,
                            backgroundColor: "#d32f2f",
                            py: 1.5,
                            fontWeight: "bold",
                        }}
                    >
                        Send Reset Password
                    </Button>
                </form>
                <Typography mt={3} textAlign="center">
                    Don’t have account?{" "}
                    <Link
                        component="button"
                        onClick={handleCreateAccount}
                        underline="hover"
                        sx={{ color: "#d32f2f", fontWeight: "bold" }}
                    >
                        Create Account
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
