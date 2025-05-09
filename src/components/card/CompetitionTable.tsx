import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

interface CompetitionTableProps {
  competitionTable: { no: number; name: string; pic: string }[];
}

const CompetitionTable: React.FC<CompetitionTableProps> = ({ competitionTable }) => (
  <Paper sx={{ p: 2, borderRadius: 1, overflowX: "auto" }}>
    <Typography fontSize={18} color="text.secondary" mb={1}>
      List Competition April
    </Typography>
    <TableContainer>
      <Table
        size="small"
        sx={{
          fontSize: 18,
          border: 1,
          borderColor: "divider",
          borderCollapse: "collapse",
        }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontSize: 15, width: 40, border: 1, borderColor: "divider" }}
            >
              No
            </TableCell>
            <TableCell
              sx={{ fontSize: 15, border: 1, borderColor: "divider" }}
            >
              Name
            </TableCell>
            <TableCell
              sx={{ fontSize: 15, border: 1, borderColor: "divider" }}
            >
              Pic
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {competitionTable.map(({ no, name, pic }) => (
            <TableRow key={no}>
              <TableCell sx={{ fontSize: 15, border: 1, borderColor: "divider" }}>
                {no}
              </TableCell>
              <TableCell sx={{ fontSize: 15, border: 1, borderColor: "divider" }}>
                {name}
              </TableCell>
              <TableCell sx={{ fontSize: 15, border: 1, borderColor: "divider" }}>
                {pic}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default CompetitionTable;
