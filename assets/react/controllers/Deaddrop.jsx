import React, {Component} from 'react';
import Leaflet from "./components/Leaflet";
import {get as getDeadrops} from "../../services/fetchDeaddrops";

export default class Deaddrop extends Component {
    constructor(props) {
        super(props);

        this.dragTimeout = null;
        this.state = {
            deaddropsMarkers: [],
        };

        this.handleZoomEnd = this.handleZoomEnd.bind(this);
        this.handleMoveEnd = this.handleMoveEnd.bind(this);

    }

    handleZoomEnd(map) {
        this.fetchMarkers(map);
    }

    handleMoveEnd(map) {
        if (this.dragTimeout) {
            clearTimeout(this.dragTimeout);
        }

        this.dragTimeout = setTimeout(() => {
            this.fetchMarkers(map);
        }, 500);
    }

    async fetchMarkers(map) {
        const deadrops = await getDeadrops(map.getBounds()._southWest.lat, map.getBounds()._northEast.lat, map.getBounds()._southWest.lng, map.getBounds()._northEast.lng)
            .then((r) => {
                this.setState({deaddropsMarkers: []})

                return r;
            });

        deadrops.forEach(deaddrop => {
            this.setState(prevState => ({
                deaddropsMarkers: [...prevState.deaddropsMarkers, {
                    position: [deaddrop.latitude, deaddrop.longitude], popupContent: deaddrop.name
                }]
            }))
        });
    }

    render() {
        return (<Leaflet
            className="h-screen-dvh"
            deaddropsMarkers={this.state.deaddropsMarkers}
            onZoomEnd={this.handleZoomEnd}
            onMoveEnd={this.handleMoveEnd}
        />)
    }
}
