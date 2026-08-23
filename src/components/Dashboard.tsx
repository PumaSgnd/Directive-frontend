import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Divider,
    CircularProgress,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import TopCard from "../components/card/TopCard";
import MiddleCard from "../components/card/MiddleCard";
import CompetitionListDropdown from "../components/card/CompetitionListDropdown";
import TotalCompetitionApril from "../components/card/TotalCompetitionApril";
import CompetitionTable from "../components/card/CompetitionTable";
import Sidebar from "../components/bar/Sidebar";
import UserMenu from "../components/header/UserMenu";
import { useStore } from "../hooks/useStore";

import { fetchPertandingan } from "../api/turnament/pertandingan/pertandingan";
import type { Pertandingan } from "../types/pertandingan";

type CompetitionKey =
    | "Semua"
    | "Penyisihan"
    | "16 Besar"
    | "Perempat Final"
    | "Semi Final"
    | "Final";

type CardData = {
    label: string;
    value: number;
};

type MiddleCardData = CardData & {
    subLabel: string;
};

type CompetitionTableData = {
    no: number;
    name: string;
    juri: Pertandingan["juri"];
};

const COMPETITIONS: CompetitionKey[] = [
    "Semua",
    "Penyisihan",
    "16 Besar",
    "Perempat Final",
    "Semi Final",
    "Final",
];

const BABAK_MAP: Record<
    Exclude<CompetitionKey, "Semua">,
    Pertandingan["babak"]
> = {
    Penyisihan: "penyisihan",
    "16 Besar": "enam_belas_besar",
    "Perempat Final": "perempat_final",
    "Semi Final": "semi_final",
    Final: "final",
};

const getPeserta = (data: Pertandingan[]) =>
    new Set(
        data.flatMap(({ peserta1_id, peserta2_id }) =>
            [peserta1_id, peserta2_id].filter(
                (id): id is number => Boolean(id)
            )
        )
    );

const Dashboard: React.FC = () => {
    const { sidebarOpen, pageTitle, setPageTitle } = useStore();

    const [competition, setCompetition] =
        useState<CompetitionKey>("Semua");
    const [pertandingan, setPertandingan] =
        useState<Pertandingan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);

    const drawerWidth = sidebarOpen ? 260 : 70;

    useEffect(() => {
        setPageTitle("Dashboard");
    }, [setPageTitle]);

    useEffect(() => {
        document.title = `Turnament Pencak Silat${pageTitle ? ` | ${pageTitle}` : ""
            }`;
    }, [pageTitle]);

    useEffect(() => {
        const handleFullscreen = () =>
            setIsFullscreen(Boolean(document.fullscreenElement));

        document.addEventListener(
            "fullscreenchange",
            handleFullscreen
        );

        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreen
            );
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await fetchPertandingan();

                setPertandingan(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Gagal load pertandingan:", err);
                setError("Gagal mengambil data pertandingan.");
                setPertandingan([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const stats = useMemo(() => {
        const pesertaSemua = getPeserta(pertandingan);

        const pesertaByBabak = Object.entries(BABAK_MAP).reduce(
            (result, [label, babak]) => {
                result[label as Exclude<CompetitionKey, "Semua">] =
                    getPeserta(
                        pertandingan.filter(
                            (item) => item.babak === babak
                        )
                    ).size;

                return result;
            },
            {} as Record<
                Exclude<CompetitionKey, "Semua">,
                number
            >
        );

        const totalCompetition: Record<CompetitionKey, number> = {
            Semua: pertandingan.length,
            Penyisihan: 0,
            "16 Besar": 0,
            "Perempat Final": 0,
            "Semi Final": 0,
            Final: 0,
        };

        pertandingan.forEach(({ babak }) => {
            const competition = (
                Object.entries(BABAK_MAP).find(
                    ([, value]) => value === babak
                )?.[0] ?? null
            ) as Exclude<CompetitionKey, "Semua"> | null;

            if (competition) {
                totalCompetition[competition]++;
            }
        });

        return {
            pesertaSemua: pesertaSemua.size,
            pesertaByBabak,
            totalCompetition,
            totalPertandingan: pertandingan.length,
            totalBerlangsung: pertandingan.filter(
                ({ status }) =>
                    status === "berlangsung" ||
                    status === "pause"
            ).length,
            totalSelesai: pertandingan.filter(
                ({ status }) => status === "selesai"
            ).length,
        };
    }, [pertandingan]);

    const topCards = useMemo<CardData[]>(
        () => [
            {
                label: "Total Semua Peserta",
                value: stats.pesertaSemua,
            },
            {
                label: "Total Peserta Babak Penyisihan",
                value: stats.pesertaByBabak.Penyisihan,
            },
            {
                label: "Total Peserta Babak 16 Besar",
                value: stats.pesertaByBabak["16 Besar"],
            },
            {
                label: "Total Peserta Babak Perempat Final",
                value: stats.pesertaByBabak["Perempat Final"],
            },
            {
                label: "Total Peserta Babak Semi Final",
                value: stats.pesertaByBabak["Semi Final"],
            },
            {
                label: "Total Peserta Babak Final",
                value: stats.pesertaByBabak.Final,
            },
        ],
        [stats]
    );

    const middleCards = useMemo<MiddleCardData[]>(
        () => [
            {
                label: "Total Pertandingan",
                subLabel: "Semua Babak",
                value: stats.totalPertandingan,
            },
            {
                label: "Pertandingan Berlangsung",
                subLabel: "Saat Ini",
                value: stats.totalBerlangsung,
            },
            {
                label: "Pertandingan Selesai",
                subLabel: "Semua Babak",
                value: stats.totalSelesai,
            },
        ],
        [stats]
    );

    const competitionTable = useMemo<CompetitionTableData[]>(
        () => {
            const selectedBabak =
                competition === "Semua"
                    ? null
                    : BABAK_MAP[competition];

            return pertandingan
                .filter(
                    (item) =>
                        !selectedBabak ||
                        item.babak === selectedBabak
                )
                .slice(0, 5)
                .map((item, index) => ({
                    no: index + 1,

                    name: `${item.peserta1_name} vs ${item.peserta2_name ?? "BYE"
                        }`,

                    juri: item.juri ?? [],
                }));
        },
        [pertandingan, competition]
    );

    const toggleFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    transition: "width 0.3s",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 1200,
                }}
            >
                <Sidebar />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    ml: `${drawerWidth}px`,
                    width: `calc(100% - ${drawerWidth}px)`,
                    maxWidth: `calc(100% - ${drawerWidth}px)`,
                    boxSizing: "border-box",
                    transition: "margin-left 0.3s, width 0.3s",
                    fontFamily: "Roboto, sans-serif",
                    background:
                        "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
                    color: "black",

                    // HILANGKAN SCROLL X & Y
                    overflowX: "hidden",
                    overflowY: "hidden",

                    p: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h2"
                        fontWeight={600}
                        fontSize={26}
                    >
                        {pageTitle}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#666",
                        }}
                    >
                        <Tooltip title="Fullscreen">
                            <IconButton
                                size="medium"
                                sx={{ color: "#666" }}
                                onClick={toggleFullscreen}
                            >
                                {isFullscreen ? (
                                    <FullscreenExitIcon />
                                ) : (
                                    <FullscreenIcon />
                                )}
                            </IconButton>
                        </Tooltip>

                        <UserMenu />
                    </Box>
                </Box>

                <Divider />

                {error && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#ffebee",
                            color: "#c62828",
                        }}
                    >
                        <Typography variant="body2">
                            {error}
                        </Typography>
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        mt: 5,
                        mb: 6,
                    }}
                >
                    {topCards.map((card) => (
                        <Box
                            key={card.label}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "31.5%",
                                    md: "41.5%",
                                    lg: "30.4%",
                                },
                                minWidth: { lg: 150 },
                            }}
                        >
                            <TopCard {...card} />
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        mb: 6,
                    }}
                >
                    {middleCards.map((card) => (
                        <Box
                            key={card.label}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "31.5%",
                                    md: "41.5%",
                                    lg: "30.4%",
                                },
                            }}
                        >
                            <MiddleCard {...card} />
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        mb: 6,
                        width: {
                            xs: "100%",
                            sm: "90%",
                            md: "87%",
                            lg: "94.2%",
                        },
                    }}>
                    <CompetitionListDropdown
                        competitionList={COMPETITIONS}
                        selectedCompetition={competition}
                        onChange={(event) =>
                            setCompetition(
                                event.target.value as CompetitionKey
                            )
                        }
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                    }}
                >
                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "54.5%",
                            },
                        }}
                    >
                        <TotalCompetitionApril
                            totalCompetitionApril={
                                stats.totalCompetition[
                                competition
                                ]
                            }
                        />
                    </Box>

                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "37.8%",
                            },
                        }}
                    >
                        <CompetitionTable
                            competitionTable={competitionTable}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
