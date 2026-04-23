import { useEffect, useState, useRef } from "react";
import { Box, Card, CardContent, Divider, Typography, Button, IconButton, Tooltip } from "@mui/material";
import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useStore } from "../../hooks/useStore";

export default function HitungTurnamen() {
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();
    const drawerWidth = sidebarOpen ? 260 : 30;
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [leftJuri1, setLeftJuri1] = useState(0);
    const [rightJuri1, setRightJuri1] = useState(0);
    const [leftJuri2, setLeftJuri2] = useState(0);
    const [rightJuri2, setRightJuri2] = useState(0);
    const [leftJuri3, setLeftJuri3] = useState(0);
    const [rightJuri3, setRightJuri3] = useState(0);

    const controllerRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleScore = (side: "left" | "right", value: number) => {
        if (side === "left") setLeftScore(prev => prev + value);
        else setRightScore(prev => prev + value);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (controllerRef.current?.requestFullscreen) {
                controllerRef.current.requestFullscreen();
            } else if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const handleReset = () => {
        setLeftScore(0);
        setRightScore(0);
        setLeftJuri1(0);
        setRightJuri1(0);
        setLeftJuri2(0);
        setRightJuri2(0);
        setLeftJuri3(0);
        setRightJuri3(0);
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
        setPageTitle("Hitung Turnamen");
    }, []);

    useEffect(() => {
        document.title = `Turnament Pencak Silat${pageTitle ? " | " + pageTitle : ""}`;
    }, [pageTitle]);

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
                sx={{ display: "flex", flexDirection: "column" }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        {pageTitle}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Fullscreen">
                            <IconButton size="medium" aria-label="Toggle fullscreen view" onClick={toggleFullscreen}>
                                {isFullscreen ? <FullscreenExitIcon fontSize="medium" /> : <FullscreenIcon fontSize="medium" />}
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>
                <Divider />
                <Card ref={controllerRef} sx={{ mt: 5, flexGrow: 1 }}>
                    <CardContent>
                        {/* TOTAL SKOR */}
                        <Box display="flex" flexDirection="column" gap={2} mb={3}>
                            <Box display="flex" gap={2}>
                                <Box flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2} textAlign="center">
                                    <Typography>Total Skor</Typography>
                                    <Typography fontSize={32} fontWeight="bold">{leftScore}</Typography>
                                </Box>
                                <Box flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2} textAlign="center">
                                    <Typography>Total Skor</Typography>
                                    <Typography fontSize={32} fontWeight="bold">{rightScore}</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" gap={2}>
                                <Box flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2}>
                                    <Typography textAlign="center" mb={1}>Juri 1</Typography>
                                    <Box display="flex" justifyContent="center" gap={2}>
                                        <Typography fontSize={28} fontWeight="bold">{leftJuri1}</Typography>
                                        <Typography fontSize={28} fontWeight="bold">{rightJuri1}</Typography>
                                    </Box>
                                </Box>
                                <Box flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2}>
                                    <Typography textAlign="center" mb={1}>Juri 2</Typography>
                                    <Box display="flex" justifyContent="center" gap={2}>
                                        <Typography fontSize={28} fontWeight="bold">{leftJuri2}</Typography>
                                        <Typography fontSize={28} fontWeight="bold">{rightJuri2}</Typography>
                                    </Box>
                                </Box>
                                <Box flex={1} bgcolor="#e0e0e0" p={3} borderRadius={2}>
                                    <Typography textAlign="center" mb={1}>Juri 3</Typography>
                                    <Box display="flex" justifyContent="center" gap={2}>
                                        <Typography fontSize={28} fontWeight="bold">{leftJuri3}</Typography>
                                        <Typography fontSize={28} fontWeight="bold">{rightJuri3}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* CONTROLLER */}
                        <Box ref={controllerRef} bgcolor="black" p={2} borderRadius={2} ml={2}>

                            {/* + BUTTON */}
                            <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gap={1} mb={1}>
                                {[1,2,3].map(n => (
                                    <Button key={n}
                                        onClick={() => handleScore("left", n)}
                                        sx={{ bgcolor:"#f44336", color:"#fff", fontSize:20 }}>
                                        {n}
                                    </Button>
                                ))}
                                {[1,2,3].map(n => (
                                    <Button key={n}
                                        onClick={() => handleScore("right", n)}
                                        sx={{ bgcolor:"#2196f3", color:"#fff", fontSize:20 }}>
                                        {n}
                                    </Button>
                                ))}
                            </Box>

                            {/* - BUTTON */}
                            <Box display="grid" gridTemplateColumns="repeat(8, 1fr)" gap={1} mb={2}>
                                {[-1,-2,-5,-10].map(n => (
                                    <Button key={n}
                                        onClick={() => handleScore("left", n)}
                                        sx={{ bgcolor:"#ef5350", color:"#fff" }}>
                                        {n}
                                    </Button>
                                ))}
                                {[-1,-2,-5,-10].map(n => (
                                    <Button key={n}
                                        onClick={() => handleScore("right", n)}
                                        sx={{ bgcolor:"#42a5f5", color:"#fff" }}>
                                        {n}
                                    </Button>
                                ))}
                            </Box>

                            {/* BOTTOM */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>

                                {/* LEFT */}
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Button onClick={() => setLeftScore(0)} sx={{ bgcolor:"red", color:"#fff" }}>
                                        X
                                    </Button>
                                    <Box sx={{
                                        border:"2px solid red",
                                        color:"#fff",
                                        px:4, py:1,
                                        fontSize:20,
                                        borderRadius:1
                                    }}>
                                        {leftScore}
                                    </Box>
                                </Box>

                                {/* CENTER */}
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Button sx={{ bgcolor:"green", color:"#fff", px:4, fontSize:18 }}>
                                        ▶ 2:00
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleReset} sx={{ minWidth: 100 }}>
                                        Reset
                                    </Button>
                                </Box>

                                {/* RIGHT */}
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box sx={{
                                        border:"2px solid #2196f3",
                                        color:"#fff",
                                        px:4, py:1,
                                        fontSize:20,
                                        borderRadius:1
                                    }}>
                                        {rightScore}
                                    </Box>
                                    <Button onClick={() => setRightScore(0)} sx={{ bgcolor:"#2196f3", color:"#fff" }}>
                                        X
                                    </Button>
                                </Box>

                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
