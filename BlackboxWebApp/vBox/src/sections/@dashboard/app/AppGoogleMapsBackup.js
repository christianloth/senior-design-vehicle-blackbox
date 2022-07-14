/*eslint-disable*/
import React from 'react';
import GoogleMapReact from 'google-map-react';
import {Card, CardHeader} from "@mui/material";

export default function AppGoogleMapsBackup(params) {
    const loadCoords = {
        center: {
            lat: 30.6280,
            lng: -96.3344
        },
        zoom: 11
    };

    const points = [
        {id: 1, title: "Hensel Park", lat: 30.629372354838726, lng: -96.34602275041988},
        {id: 2, title: "Zachary", lat: 30.62140011074789, lng: -96.340249159839},
        {id: 3, title: "The Cottages", lat: 30.58269261248064, lng: -96.33920185267925}
    ];


    const addDirections = (map, maps) => {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        const origin = {
            lat: points[0].lat, lng: points[0].lng
        };

        const mid = {
            lat: points[1].lat, lng: points[1].lng
        };

        const destination = {
            lat: points[2].lat, lng: points[2].lng
        };

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    const renderPoints = (map, maps) => {
        const markers = [];
        for (let i = 0; i < points.length; i++) {
            markers[i] = new maps.Marker({
                position: {
                    lat: points[i].lat,
                    lng: points[i].lng
                },
                map,
                text: points[i].title,
            });
        }

        return markers;
    }

    const ltlng = [];
    for (let i = 0; i < points.length; i++) {
        ltlng.push(({lat: points[i].lat, lng: points[i].lng}));
    }

    const linePath = (map, maps) => {
        const path = new google.maps.Polyline({
            path: ltlng,
            geodesic: true,
            strokeColor: '#4986E7',
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