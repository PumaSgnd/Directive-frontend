import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Tooltip, Divider } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import TopCard from "../components/card/TopCard";
import MiddleCard from "../components/card/MiddleCard";
import CompetitionListDropdown from "../components/card/CompetitionListDropdown";
import TotalCompetitionApril from "../components/card/TotalCompetitionApril";
import CompetitionTable from "../components/card/CompetitionTable";
import Sidebar from "../components/bar/Sidebar";
import UserMenu from "../components/header/UserMenu";
import { useStore } from "../hooks/useStore";

const data: {
    topCards: {
        label: string;
        value: number;
    }[];
    middleCards: {
        label: string;
        subLabel: string;
        value: number;
    }[];
    competitionList: string[];
    totalCompetition: { [key: string]: number };
    competitionTable: {
        no: number;
        name: string;
        pic: string;
    }[];
} = {
    topCards: [
        { label: "Total All Registration Competition", value: 6 },
        { label: "Total Definitive Registration Competitions", value: 1 },
        { label: "Total Nominative Registration Competition", value: 2 },
        { label: "Total Done Registration Competition", value: 3 },
    ],
    middleCards: [
        { label: "Total Open Registrations", subLabel: "24 - April - 2023", value: 0 },
        { label: "Total Registrations", subLabel: "April", value: 0 },
        { label: "Total Registrations", subLabel: "2023", value: 6 },
    ],
    competitionList: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "July",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ],
    totalCompetition: {
        Januari: 1,
        Februari: 2,
        Maret: 3,
        April: 4,
        Mei: 5,
        Juni: 0,
        July: 0,
        Agustus: 0,
        September: 0,
        Oktober: 0,
        November: 0,
        Desember: 0
    },
    competitionTable: [
        { no: 1, name: "Test Competition 4", pic: "Woro Endang" },
        { no: 2, name: "Test Competition 5", pic: "Woro Endang" },
        { no: 3, name: "Test Competition 6", pic: "Woro Endang" },
        { no: 4, name: "Test Competition 7", pic: "Woro Endang" },
        { no: 5, name: "Test Competition 8", pic: "Dian Arifin" },
    ]
};

const Dashboard: React.FC = () => {
    const { sidebarOpen, pageTitle } = useStore();
    const [competition, setCompetition] = useState("April");
    const drawerWidth = sidebarOpen ? 240 : 70;

    useEffect(() => {
        document.title = `${pageTitle}`;
    }, [pageTitle]);

    return (
        <Box sx={{ display: "flex", flexDirection: "row", height: "100vh", width: "100vw", overflowX: "hidden" }}>
            <Box sx={{ width: drawerWidth, transition: "width 0.3s", position: "fixed" }}>
                <Sidebar />
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    transition: "margin-left 0.3s",
                    ml: `${drawerWidth}px`,
                    padding: 5,
                    fontFamily: "Roboto, sans-serif",
                    background: "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
                    color: "black",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h2" fontWeight={600} fontSize={26}>
                        {pageTitle}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 10, color: "#666" }}>
                        <Tooltip title="Fullscreen">
                            <IconButton size="medium" sx={{ color: "#666" }}>
                                <FullscreenIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                        <UserMenu />
                    </Box>
                </Box>
                <Divider />
                <Divider />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 5, mb: 6 }}>
                    {data.topCards.map(({ label, value }, i) => (
                        <Box key={i} sx={{ width: { xs: "100%", sm: "55%", md: "23.85%" } }}>
                            <TopCard label={label} value={value} />
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 6 }}>
                    {data.middleCards.map(({ label, subLabel, value }, i) => (
                        <Box key={i} sx={{ width: { xs: "100%", md: "32.3%" } }}>
                            <MiddleCard label={label} subLabel={subLabel} value={value} />
                        </Box>
                    ))}
                </Box>
                <Box sx={{ mb: 6 }}>
                    <CompetitionListDropdown
                        competitionList={data.competitionList}
                        selectedCompetition={competition}
                        onChange={(e) => setCompetition(e.target.value as string)}
                    />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <Box sx={{ width: { xs: "100%", md: "60%" } }}>
                        <TotalCompetitionApril totalCompetitionApril={data.totalCompetition[competition]} />
                    </Box>
                    <Box sx={{
                        width: { xs: "100wh", md: "37.8%" },
                    }}>
                        <CompetitionTable competitionTable={data.competitionTable} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
