import React, {Component} from 'react';
import Leaflet from "./components/Leaflet";
import {get as getDeaddrops} from "../../services/fetchDeaddrops";
import Sidebar from "./components/Sidebar/Sidebar";

export default class Deaddrop extends Component {
    constructor(props) {
        super(props);

        this.dragTimeout = null;
        this.state = {
            deaddrops: [],
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
        const deaddrops = await getDeaddrops(map.getBounds()._southWest.lat, map.getBounds()._northEast.lat, map.getBounds()._southWest.lng, map.getBounds()._northEast.lng)
            .then((r) => {
                this.setState({deaddrops: []})

                return r;
            });

        deaddrops.forEach(deaddrop => {
            this.setState((prevState) => ({
                deaddrops: [...prevState.deaddrops, deaddrop]
            }));
        });
    }

    render() {
        return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-screen-dvh">
            <div className="col-span-1 w-full">
                <Sidebar
                    deaddrops={this.state.deaddrops}
                />
            </div>
            <div className="col-span-1 lg:col-span-3 md:rounded-l-xl">
                <Leaflet
                    className="h-full"
                    deaddropsMarkers={this.state.deaddrops}
                    onZoomEnd={this.handleZoomEnd}
                    onMoveEnd={this.handleMoveEnd}
                />
            </div>
        </div>)
    }
}
