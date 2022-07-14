/*eslint-disable*/
import React from 'react';
import GoogleMapReact from 'google-map-react';
import {Card, CardHeader} from "@mui/material";

export default function AppGoogleMapsBackup(params) {

    // JavaScript anonymous function

    // if (window.sessionStorage) {
    //     if (!sessionStorage.getItem('reload')) {
    //         sessionStorage['reload'] = true;
    //         window.location.reload();
    //     } else {
    //
    //         // Don't refresh twice
    //         sessionStorage.removeItem('reload');
    //     }
    // }


    const loadCoords = {
        center: { //pick random point in coordinates to center map on
            lat: params.lats[10],
            lng: params.longs[10]
        },
        zoom: 11
    };

    const renderPoints = (map, maps) => {
        const markers = [];

        markers[0] = new maps.Marker({
            position: {
                lat: params.lats[0],
                lng: params.longs[0],
            },
            map,
            label: {color: '#000000', fontWeight: 'bold', fontSize: '18px', text: 'S'}
        });

        markers[0] = new maps.Marker({
            position: {
                lat: params.lats[params.lats.length - 1],
                lng: params.longs[params.lats.length - 1]
            },
            map,
            label: {color: '#000000', fontWeight: 'bold', fontSize: '18px', text: 'F'}
        });

        return markers;
    }

    const ltlng = [];
    for (let i = 0; i < params.lats.length; i++) {
        // dont allow any 0,0 coordinates to be plotted, or else line will draw over to Africa.
        if (params.lats[i] == 0 && params.longs[i] == 0) {
            params.lats.shift();
            params.longs.shift();
        }
        ltlng.push(({lat: params.lats[i], lng: params.longs[i]}));
    }

    const linePath = (map, maps) => {
        const path = new google.maps.Polyline({
            path: ltlng,
            geodesic: true,
            strokeColor: '#3681f8',
            strokeOpacity: 1.0,
            strokeWeight: 2

        });
        path.setMap(map);
    }

    return (
        // Important! Always set the container height explicitly
        <Card style={{height: '85vh', width: '100%', margin: '0%', paddingBottom: '6em'}}>
            <CardHeader title="Google Maps API"
                        subheader="This graph shows the total trip where the vehicle went."/>
            <GoogleMapReact
                padding='71em'
                bootstrapURLKeys={{key: "AIzaSyC-Hl_WSR1Q6e8vzHddiMqeCEVNmBh490w"}}
                mapContainerStyle={{width: "95px", height: "400px"}}
                defaultCenter={loadCoords.center}
                defaultZoom={loadCoords.zoom}
                center={loadCoords.center}
                size={{width: 0, height: 0}}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => {
                    renderPoints(map, maps); //load in all of our points
                    //addDirections(map, maps); //add direction line between point(s)
                    linePath(map, maps); //add the direct path between all GPS coordinates
                }
                }
            >
            </GoogleMapReact>
        </Card>
    );
}