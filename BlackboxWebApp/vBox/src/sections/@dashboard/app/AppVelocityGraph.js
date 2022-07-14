/*eslint-disable*/
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../../components/charts';

// ----------------------------------------------------------------------

export default function AppVelocityGraph(params) {

  const CHART_DATA = [
    {
      name: 'Velocity',
      type: 'line',
      data: params.velocities
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
            return `${y.toFixed(2)} mi/h`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Velocity Graph" subheader="Velocity (mi/h) vs. Time (sec) Graph" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
