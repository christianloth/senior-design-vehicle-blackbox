/* eslint-disable */
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import { fShortenNumber} from "../../../utils/formatNumber";
// component

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

// ----------------------------------------------------------------------

export default function AppAverageVelocity(average_velocity) {
  return (
    <RootStyle>
      <Typography variant="h3">{`${fShortenNumber(average_velocity.average_velocity)} mi/h`}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Average Velocity
      </Typography>
    </RootStyle>
  );
}
