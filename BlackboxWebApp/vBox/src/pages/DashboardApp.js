/*eslint-disable*/
// material
import {Box, Grid, Container, Typography} from '@mui/material';

import Login from "./Login";
import useToken from './useToken';

// components
import Page from '../components/Page';
import {
    AppAverageVelocity,
    AppAverageRPM,
    AppAverageAcceleration,
    AppBlackboxConclusion,
    AppTripTime,
    AppVelocityGraph,
    AppAccelerationGraph,
    AppThrottlePosition,
    AppGoogleMaps,
    AppVideoPlayer
} from '../sections/@dashboard/app';
import DashboardLayout from "../layouts/dashboard";
import {fetchAPI, getTripData} from "./APIRequest";
import {useState} from "react";

// ----------------------------------------------------------------------

export default function DashboardApp({tripNum}) {

    // Saving userToken argument to sessionStorage w/ setItem
    // Each new tab will have to reauthenticate

    const [state, setState] = useState({
        tripN: tripNum,
        loaded: 0
    });

    const {token, setToken} = useToken();

    if (!token) {
        return <Login setToken={setToken}/>
    }


    let tripData;
    var average_acceleration, average_rpm, average_velocity, velocities, throttle_positions, times, trip_time, lats,
        longs;
    let delta_acc_x, delta_acc_y, delta_acc_z;
    let conclusion_1, conclusion_2, conclusion_3, conclusion_4, conclusion_5; 

    fetchAPI(tripNum).then(result => {
        setState({
            tripN: tripNum,
            loaded: 1
        });
        sessionStorage.removeItem("trip" + tripNum + "Data"); //promise
    });


    if (state.tripN == tripNum && state.loaded == 1) {

        tripData = getTripData(tripNum);

        average_acceleration = JSON.parse(tripData.average_acceleration);
        average_rpm = JSON.parse(tripData.average_rpm);
        average_velocity = JSON.parse(tripData.average_speed); //little mess up here
        velocities = JSON.parse(tripData.speed);
        throttle_positions = JSON.parse(tripData.throttle_position);
        times = JSON.parse(tripData.time);
        trip_time = JSON.parse(tripData.trip_time);
        lats = JSON.parse(tripData.lat);
        longs = JSON.parse(tripData.long);

        conclusion_1 = tripData.conclusion_1;
        conclusion_2 = tripData.conclusion_2;
        conclusion_3 = tripData.conclusion_3;
        conclusion_4 = tripData.conclusion_4;
        conclusion_5 = tripData.conclusion_5;

        // Just so that the page loads in case there is no accel data


        delta_acc_x = JSON.parse(tripData.delta_acc_x);
        delta_acc_y = JSON.parse(tripData.delta_acc_y);
        delta_acc_z = JSON.parse(tripData.delta_acc_z);

        // normalize time values
        // let timeInd0 = times[0];
        // for (let i = 0; i < times.length; i++) {
        //     times[i] = times[i] - timeInd0;
        // }

        // var date1 = new Date("2022-04-14 01:47:05");
        // console.log(date1)


    }

    let ret = (state.tripN == tripNum && state.loaded == 1) ? (
        <Page title="Dashboard">

            <DashboardLayout/>
            <Container maxWidth="xl">

                <Box sx={{pb: 5}} mt={-18} ml={18} px={22}>
                    <Typography variant="h4">Blackbox Data Analyzation Web App</Typography>
                </Box>

                <Grid container spacing={3} ml={15} px={22}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppTripTime time={trip_time}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppAverageVelocity average_velocity={average_velocity}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppAverageAcceleration acceleration={average_acceleration}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppAverageRPM average_rpm={average_rpm}/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={12}>
                        <AppVelocityGraph velocities={velocities} times={times}/>
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                        <AppAccelerationGraph delta_acc_x={delta_acc_x} delta_acc_y={delta_acc_y}
                                              delta_acc_z={delta_acc_z} times={times}/>
                    </Grid>
                    {/*<Grid item xs={12} md={6} lg={6}>*/}
                    {/*    <AppBreakingGraph/>*/}
                    {/*</Grid>*/}
                    <Grid item xs={6} md={6} lg={6}>
                        <AppThrottlePosition throttle_positions={throttle_positions} times={times}/>
                    </Grid>
                    <Grid item xs={6} md={4} lg={12}>
                        <AppGoogleMaps lats={lats} longs={longs}/>
                    </Grid>

                    {/*Google API Key: AIzaSyC-Hl_WSR1Q6e8vzHddiMqeCEVNmBh490w*/}

                    <Grid item xs={12} md={6} lg={6}>
                        <AppBlackboxConclusion conclusion_1={conclusion_1} conclusion_2={conclusion_2} conclusion_3={conclusion_3} conclusion_4={conclusion_4} conclusion_5={conclusion_5}/>
                    </Grid>
                    <Grid item xs={6} md={4} lg={6}>
                        <AppVideoPlayer tripNum={tripNum}/>
                    </Grid>
                </Grid>

            </Container>

        </Page>

    ) : <div>
        Loading...
    </div>;

    return (
        <div>
            {ret}
        </div>);
}
