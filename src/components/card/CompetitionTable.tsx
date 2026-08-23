import * as React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import type { JuriPertandingan } from "../../types/pertandingan";

interface CompetitionTableProps {
    competitionTable: {
        no: number;
        name: string;
        juri: JuriPertandingan[];
    }[];
}

const CompetitionTable: React.FC<CompetitionTableProps> = ({
    competitionTable,
}) => (
    <Paper
        sx={{
            p: 2,
            borderRadius: 1,
            overflowX: "auto",
        }}
    >
        <Typography
            fontSize={18}
            color="text.secondary"
            mb={1}
        >
            List Competition
        </Typography>

        <TableContainer>
            <Table
                size="small"
                sx={{
                    fontSize: 18,
                    border: 1,
                    borderColor: "divider",
                    borderCollapse: "collapse",
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                fontSize: 15,
                                width: 40,
                                border: 1,
                                borderColor: "divider",
                            }}
                        >
                            No
                        </TableCell>

                        <TableCell
                            sx={{
                                fontSize: 15,
                                border: 1,
                                borderColor: "divider",
                            }}
                        >
                            Competition
                        </TableCell>

                        <TableCell
                            sx={{
                                fontSize: 15,
                                border: 1,
                                borderColor: "divider",
                            }}
                        >
                            Juri
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {competitionTable.map(
                        ({ no, name, juri }) => (
                            <TableRow key={no}>
                                <TableCell
                                    sx={{
                                        fontSize: 15,
                                        border: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    {no}
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontSize: 15,
                                        border: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    {name}
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontSize: 15,
                                        border: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    {juri.length > 0
                                        ? juri
                                              .map(
                                                  (j) =>
                                                      j.full_name
                                              )
                                              .join(", ")
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
);

export default CompetitionTable;