import React, {forwardRef, useEffect, useRef} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet'
import PropTypes from 'prop-types';
import markerIconPng from "leaflet/dist/images/marker-icon.png"

const Leaflet = forwardRef((props, ref) => {
    const {
        center,
        zoom,
        deaddrops,
        onZoomEnd,
        onMoveEnd,
        selectedMarker,
        onMarkerSelect,
        markerFolder
    } = props;

    const mapRef = useRef(null);

    const Events = () => {
        const map = useMapEvents({
            zoomend: () => {
                onZoomEnd(map);
            }, dragend: () => {
                onMoveEnd(map);
            },
        });

        return null
    }

    useEffect(() => {
        if (mapRef.current && selectedMarker) {
            mapRef.current.flyTo(
                [selectedMarker.latitude, selectedMarker.longitude],
                16,
                {
                    duration: 2,
                }
            );
        }
    }, [selectedMarker]);

    return (<MapContainer
        className="h-screen-dvh md:rounded-l-xl"
        center={center ?? [47, 0]}
        zoom={zoom ?? 4}
        ref={(map) => {
            ref.current = map;
            mapRef.current = map;
        }}
        whenReady={(map) => {
            onZoomEnd(map.target);
        }}
    >
        <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        />

        {deaddrops.map((point, index) => (
            <Marker
                eventHandlers={{
                    click: () => {
                        onMarkerSelect(point)
                    },
                }}
                key={index}
                position={[point.latitude, point.longitude]}
                icon={new L.Icon({
                    iconUrl: markerFolder + "/good_pin.svg",
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                    popupAnchor: [0, -12],
                })}
            >
                <Popup>{point.name}</Popup>
            </Marker>
        ))}


        <Events/>
    </MapContainer>);
})

export default Leaflet;