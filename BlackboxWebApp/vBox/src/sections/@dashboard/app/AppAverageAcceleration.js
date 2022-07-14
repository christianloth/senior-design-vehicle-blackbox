// material
import { styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import {fShortenNumber} from "../../../utils/formatNumber";
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

// ----------------------------------------------------------------------


export default function AppAverageAcceleration({acceleration}) {
  return (
    <RootStyle>
      <Typography variant="h3">{`${fShortenNumber(acceleration)} m/s²`}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Average Acceleration
      </Typography>
    </RootStyle>
  );
}
