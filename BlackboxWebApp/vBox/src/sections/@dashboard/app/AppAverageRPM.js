// material
import { styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
}));

// ----------------------------------------------------------------------

// eslint-disable-next-line camelcase
export default function AppAverageRPM({average_rpm}) {
  return (
    <RootStyle>
      <Typography variant="h3">{`${fNumber(average_rpm)} rpm`}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Average RPM
      </Typography>
    </RootStyle>
  );
}
