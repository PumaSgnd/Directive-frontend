import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
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
    Divider,
    TextField,
    MenuItem,
    TablePagination,
    Chip,
    Button,
} from "@mui/material";

import {
    Fullscreen,
    FullscreenExit,
    Search,
    Monitor,
    Add,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";

import Sidebar from "../bar/Sidebar";
import UserMenu from "../header/UserMenu";

import { useStore } from "../../hooks/useStore";
import { usePertandingan } from "../../hooks/usePertandingan";

import {
    fetchScoreboard,
} from "../../api/turnament/penilaian/penilaian";

import PaginationActions from "../custom/PaginationActions";

const POLL_INTERVAL_MS = 1000;

type MatchScore = {
    peserta1: number;
    peserta2: number;
};

export default function Score() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        sidebarOpen,
        pageTitle,
        setPageTitle,
    } = useStore();

    const drawerWidth =
        sidebarOpen ? 260 : 70;

    const {
        pertandingan,
        loading,
    } = usePertandingan("final");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<
            | "semua"
            | "belum_mulai"
            | "berlangsung"
            | "pause"
            | "selesai"
        >("semua");

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [isFullscreen, setIsFullscreen] =
        useState(false);

    const [scores, setScores] =
        useState<
            Record<number, MatchScore>
        >({});

    useEffect(() => {
        setPageTitle(t("skor"));
    }, [
        setPageTitle,
        t,
    ]);

    useEffect(() => {
        document.title =
            `${t("tournamentTitle")}${pageTitle
                ? " | " + pageTitle
                : ""
            }`;
    }, [
        pageTitle,
        t,
    ]);

    useEffect(() => {
        const loadScores =
            async () => {
                if (
                    !pertandingan ||
                    pertandingan.length === 0
                ) {
                    setScores({});
                    return;
                }

                const results =
                    await Promise.all(
                        pertandingan.map(
                            async (match) => {
                                try {
                                    const scoreboard =
                                        await fetchScoreboard(
                                            match.id
                                        );

                                    return {
                                        id: match.id,
                                        peserta1:
                                            Number(
                                                scoreboard
                                                    ?.peserta1
                                                    ?.total ??
                                                0
                                            ),
                                        peserta2:
                                            Number(
                                                scoreboard
                                                    ?.peserta2
                                                    ?.total ??
                                                0
                                            ),
                                    };
                                } catch {
                                    return {
                                        id: match.id,
                                        peserta1: 0,
                                        peserta2: 0,
                                    };
                                }
                            }
                        )
                    );

                const scoreMap:
                    Record<
                        number,
                        MatchScore
                    > = {};

                results.forEach(
                    (item) => {
                        scoreMap[
                            item.id
                        ] = {
                            peserta1:
                                item.peserta1,
                            peserta2:
                                item.peserta2,
                        };
                    }
                );

                setScores(scoreMap);
            };

        loadScores();

        const interval =
            setInterval(
                loadScores,
                POLL_INTERVAL_MS
            );

        return () =>
            clearInterval(interval);
    }, [pertandingan]);

    const toggleFullscreen =
        async () => {
            try {
                if (
                    !document.fullscreenElement
                ) {
                    await document.documentElement.requestFullscreen();
                } else {
                    await document.exitFullscreen();
                }
            } catch (error) {
                console.error(
                    "Fullscreen error:",
                    error
                );
            }
        };

    useEffect(() => {
        const handleFullscreenChange =
            () => {
                setIsFullscreen(
                    !!document.fullscreenElement
                );
            };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

    const formatText = (
        text?: string | null
    ) => {
        if (!text) {
            return "";
        }

        return text
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    const getStatusText = (
        status?: string
    ) => {
        switch (status) {
            case "belum_mulai":
                return t(
                    "belum_mulai"
                );

            case "berlangsung":
                return t(
                    "berlangsung"
                );

            case "pause":
                return t(
                    "pause"
                );

            case "selesai":
                return t(
                    "selesai"
                );

            default:
                return t("semua");
        }
    };

    const getStatusColor = (
        status?: string
    ):
        | "default"
        | "warning"
        | "success"
        | "info" => {
        switch (status) {
            case "berlangsung":
                return "warning";

            case "selesai":
                return "success";

            case "pause":
                return "info";

            default:
                return "default";
        }
    };

    const filteredMatches =
        useMemo(() => {
            let data = [
                ...(pertandingan || []),
            ];

            if (search.trim()) {
                const query =
                    search
                        .trim()
                        .toLowerCase();

                data =
                    data.filter(
                        (item) => {
                            const peserta1 =
                                item
                                    .peserta1_name
                                    ?.toLowerCase() ??
                                "";

                            const peserta2 =
                                item
                                    .peserta2_name
                                    ?.toLowerCase() ??
                                "";

                            return (
                                peserta1.includes(
                                    query
                                ) ||
                                peserta2.includes(
                                    query
                                )
                            );
                        }
                    );
            }

            if (
                statusFilter !==
                "semua"
            ) {
                data =
                    data.filter(
                        (item) =>
                            item.status ===
                            statusFilter
                    );
            }

            return data;
        }, [
            pertandingan,
            search,
            statusFilter,
        ]);

    const paginatedMatches =
        useMemo(() => {
            const start =
                page *
                rowsPerPage;

            return filteredMatches.slice(
                start,
                start +
                rowsPerPage
            );
        }, [
            filteredMatches,
            page,
            rowsPerPage,
        ]);

    useEffect(() => {
        setPage(0);
    }, [
        search,
        statusFilter,
    ]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight:
                        "100vh",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
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
                minHeight:
                    "100vh",
                width: "100vw",
                overflowX:
                    "hidden",
                background:
                    "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
            }}
        >
            <Box
                sx={{
                    width:
                        drawerWidth,
                    transition:
                        "width 0.3s",
                    position:
                        "fixed",
                    height:
                        "100vh",
                    zIndex: 1200,
                }}
            >
                <Sidebar />
            </Box>

            <Box
                flexGrow={1}
                ml={`${drawerWidth}px`}
                p={3}
                fontFamily="Roboto, sans-serif"
                sx={{
                    minWidth: 0,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography
                        variant="h2"
                        fontWeight={600}
                        fontSize={26}
                    >
                        {pageTitle}
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        <Tooltip
                            title={
                                isFullscreen
                                    ? t(
                                        "exitFullscreen"
                                    )
                                    : t(
                                        "fullscreen"
                                    )
                            }
                        >
                            <IconButton
                                size="medium"
                                aria-label={
                                    isFullscreen
                                        ? t(
                                            "exitFullscreen"
                                        )
                                        : t(
                                            "fullscreen"
                                        )
                                }
                                onClick={
                                    toggleFullscreen
                                }
                                sx={{
                                    "&:hover":
                                    {
                                        backgroundColor:
                                            "transparent",
                                    },
                                }}
                            >
                                {isFullscreen ? (
                                    <FullscreenExit />
                                ) : (
                                    <Fullscreen />
                                )}
                            </IconButton>
                        </Tooltip>

                        <UserMenu />
                    </Box>
                </Box>

                <Divider />

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                    gap={2}
                    flexWrap="wrap"
                >
                    <TextField
                        select
                        size="small"
                        value={
                            statusFilter
                        }
                        onChange={(
                            e
                        ) =>
                            setStatusFilter(
                                e.target
                                    .value as
                                | "semua"
                                | "belum_mulai"
                                | "berlangsung"
                                | "pause"
                                | "selesai"
                            )
                        }
                        sx={{
                            minWidth: 180,
                        }}
                    >
                        <MenuItem value="semua">
                            {t("semua")}
                        </MenuItem>

                        <MenuItem value="belum_mulai">
                            {t(
                                "belum_mulai"
                            )}
                        </MenuItem>

                        <MenuItem value="berlangsung">
                            {t(
                                "berlangsung"
                            )}
                        </MenuItem>

                        <MenuItem value="pause">
                            {t("pause")}
                        </MenuItem>

                        <MenuItem value="selesai">
                            {t(
                                "selesai"
                            )}
                        </MenuItem>
                    </TextField>

                    <TextField
                        size="small"
                        placeholder={t(
                            "searchParticipant"
                        )}
                        value={search}
                        onChange={(
                            e
                        ) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        InputProps={{
                            startAdornment:
                                (
                                    <Search
                                        fontSize="small"
                                        sx={{
                                            mr: 1,
                                        }}
                                    />
                                ),
                        }}
                        sx={{
                            width: 280,
                        }}
                    />
                </Box>

                <Card
                    sx={{
                        mt: 3,
                    }}
                >
                    <CardContent>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            {t(
                                                "no"
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t(
                                                "match"
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t(
                                                "skor"
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t(
                                                "status"
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            {t(
                                                "actions"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedMatches.length ===
                                        0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={
                                                    5
                                                }
                                                align="center"
                                            >
                                                <Box
                                                    py={
                                                        6
                                                    }
                                                >
                                                    <Typography
                                                        color="text.secondary"
                                                    >
                                                        {t(
                                                            "noMatchesFound"
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedMatches.map(
                                            (
                                                match,
                                                index
                                            ) => {
                                                const score1 =
                                                    scores[
                                                        match
                                                            .id
                                                    ]
                                                        ?.peserta1 ??
                                                    0;

                                                const score2 =
                                                    scores[
                                                        match
                                                            .id
                                                    ]
                                                        ?.peserta2 ??
                                                    0;

                                                return (
                                                    <TableRow
                                                        key={
                                                            match.id
                                                        }
                                                        hover
                                                    >
                                                        <TableCell align="center">
                                                            {page *
                                                                rowsPerPage +
                                                                index +
                                                                1}
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Box
                                                                display="flex"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                gap={1}
                                                            >
                                                                <Typography
                                                                    fontWeight={
                                                                        600
                                                                    }
                                                                >
                                                                    {formatText(
                                                                        match.peserta1_name
                                                                    )}
                                                                </Typography>

                                                                <Typography
                                                                    fontWeight={
                                                                        700
                                                                    }
                                                                    color="error.main"
                                                                    fontSize={
                                                                        12
                                                                    }
                                                                >
                                                                    VS
                                                                </Typography>

                                                                <Typography
                                                                    fontWeight={
                                                                        600
                                                                    }
                                                                >
                                                                    {match.peserta2_name
                                                                        ? formatText(
                                                                            match.peserta2_name
                                                                        )
                                                                        : t(
                                                                            "bye"
                                                                        )}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Typography
                                                                fontWeight={
                                                                    700
                                                                }
                                                                fontSize={
                                                                    16
                                                                }
                                                            >
                                                                {
                                                                    score1
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    score2
                                                                }
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Chip
                                                                label={getStatusText(
                                                                    match.status
                                                                )}
                                                                color={getStatusColor(
                                                                    match.status
                                                                )}
                                                                size="medium"
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Tooltip
                                                                title={t(
                                                                    "openMonitor"
                                                                )}
                                                            >
                                                                <IconButton
                                                                    color="success"
                                                                    onClick={() =>
                                                                        window.open(
                                                                            `/hitungTurnamen/skor/${match.id}?monitor=true`,
                                                                            "_blank",
                                                                            "noopener,noreferrer"
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        "&:hover":
                                                                        {
                                                                            backgroundColor:
                                                                                "transparent",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Monitor />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={5}
                            mb={2}
                        >
                            <TablePagination
                                component="div"
                                count={filteredMatches.length}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(
                                        parseInt(event.target.value, 10)
                                    );
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} of ${count}`
                                }
                                labelRowsPerPage={t("rows")}
                                ActionsComponent={PaginationActions}
                                sx={{
                                    "& .MuiTablePagination-select": {
                                        border: "1px solid #ccc",
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Add />}
                                onClick={() =>
                                    navigate(
                                        "/pertandingan/perempat-final/create-perempat-final"
                                    )
                                }
                            >
                                {t("create")}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}