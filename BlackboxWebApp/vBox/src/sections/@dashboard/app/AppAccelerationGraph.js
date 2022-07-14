/*eslint-disable*/
import {merge} from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import {Box, Card, CardHeader} from '@mui/material';
// utils
//
import {BaseOptionChart} from '../../../components/charts';

// ----------------------------------------------------------------------

export default function AppAccelerationGraph(params) {
    var mags = []
    for (let i = 0; i < params.delta_acc_x.length; i++) {
        mags[i] = (Math.sqrt(Math.pow(params.delta_acc_x[i], 2)
            + Math.pow(params.delta_acc_y[i], 2) + Math.pow(params.delta_acc_z[i], 2))).toFixed(2);
        // console.log(mags[i]);
    }

    const CHART_DATA = [
        {
            name: 'Acceleration',
            type: 'line',
            data: mags
        }
    ];

    const chartOptions = merge(BaseOptionChart(), {
        stroke: {width: 3},
        plotOptions: {bar: {columnWidth: '11%', borderRadius: 4}},
        fill: {type: 'solid'},
        labels: params.times,
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y.toFixed(2)} m/s²`;
                    }
                    return y;
                }
            }
        }
    });

    return (
        <Card>
            <CardHeader title="Acceleration Graph" subheader="Acceleration (m/s²) vs. Time (sec) Graph"/>
            <Box sx={{p: 3, pb: 1}} dir="ltr">
                <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364}/>
            </Box>
        </Card>
    );
}
