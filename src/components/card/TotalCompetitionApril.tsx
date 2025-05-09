import React from "react";
import { Paper, Typography } from "@mui/material";

interface TotalCompetitionAprilProps {
  totalCompetitionApril: number;
}

const TotalCompetitionApril: React.FC<TotalCompetitionAprilProps> = ({
  totalCompetitionApril,
}) => (
  <Paper sx={{ p: 2, borderRadius: 1 }}>
    <Typography fontSize={18} color="text.secondary" mb={0.5}>
      Total Competition April
    </Typography>
    <Typography fontWeight={700} fontSize={18}>
      {totalCompetitionApril}
    </Typography>
  </Paper>
);

export default TotalCompetitionApril;
