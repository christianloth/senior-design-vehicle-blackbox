/*eslint-disable*/
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../../components/charts';

// ----------------------------------------------------------------------

export default function AppThrottlePosition(params) {

  const CHART_DATA = [
    {
      name: 'Throttle Position',
      type: 'line',
      data: params.throttle_positions
    }

  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 3 },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: 'solid' },
    labels: params.times,
    // xaxis: { type: 'times' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(2)}`;
          }
          return y;
        }
      }
    }
  });

  return (
      <Card>
        <CardHeader title="Throttle Position" subheader="This graph describes all of the throttle positions our vehicle was in with respect to time." />
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
          <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
        </Box>
      </Card>
  );
}
