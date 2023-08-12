import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents} from 'react-leaflet'
import PropTypes from 'prop-types';
import markerIconPng from "leaflet/dist/images/marker-icon.png"

export default function Leaflet(props) {
    const {
        center, zoom, deaddropsMarkers, onZoomEnd, onMoveEnd
    } = props;

    const Events = () => {
        const map = useMapEvents({
            zoomend: (event) => {
                onZoomEnd(map);
            }, dragend: (event) => {
                onMoveEnd(map);
            },
        });

        return null
    }

    return (<MapContainer
        className="h-screen-dvh md:rounded-l-xl"
        center={center}
        zoom={zoom}
        whenReady={(map) => {
            onZoomEnd(map.target);
        }}
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        />

        {deaddropsMarkers.map((point, index) => (<Marker
            key={index}
            position={point.position}
            icon={new L.Icon({
                iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
            })}
        >
            <Popup>{point.popupContent}</Popup>
        </Marker>))}


        <Events/>
    </MapContainer>);
}


Leaflet.propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    deaddropsMarkers: PropTypes.array,
    onZoomEnd: PropTypes.func,
    onMoveEnd: PropTypes.func,
};

Leaflet.defaultProps = {
    center: [47, 0], zoom: 4, deaddropsMarkers: [], onZoomEnd: () => {
    }, onMoveEnd: () => {
    },
};
