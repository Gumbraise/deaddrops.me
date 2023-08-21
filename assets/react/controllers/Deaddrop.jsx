import React, {Component, createRef} from 'react';
import Leaflet from "./components/Leaflet";
import {get as getDeaddrop, getAll as getDeaddrops} from "../../services/fetchDeaddrops";
import Sidebar from "./components/Sidebar/Sidebar";

export default class Deaddrop extends Component {
    constructor(props) {
        super(props);

        this.dragTimeout = null;
        this.state = {
            deaddrops: [],
            selectedMarker: null,
            loading: false,
            selectedDeaddrop: null,
            isDeaddropSelected: false,
            _lastPos: null,
        };

        this.mapRef = createRef();

        this.handleZoomEnd = this.handleZoomEnd.bind(this);
        this.handleMoveEnd = this.handleMoveEnd.bind(this);
        this.handleMarkerSelect = this.handleMarkerSelect.bind(this);
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

    handleMarkerSelect(selectedMarker) {
        this.setState({
            selectedMarker,
            _lastPos: {
                ...this.mapRef.current._lastCenter,
                zoom: this.mapRef.current._zoom
            }
        });
        this.fetchDeaddrop(selectedMarker.deaddropId);
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

    async fetchDeaddrop(deaddropId) {
        this.setState({loading: true, isDeaddropSelected: true})
        return await getDeaddrop(deaddropId)
            .then((r) => {
                this.setState({loading: false, selectedDeaddrop: r})
            });
    }

    backToMap() {
        this.setState({isDeaddropSelected: false})
        this.mapRef.current.flyTo(
            [this.state._lastPos.lat, this.state._lastPos.lng],
            this.state._lastPos.zoom,
            {
                duration: .5,
            }
        );
    }

    render() {
        return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-screen-dvh">
            <div className="col-span-1 w-full">
                <Sidebar
                    deaddrops={this.state.deaddrops}
                    loading={this.state.loading}
                    selectedDeaddrop={this.state.selectedDeaddrop}
                    isDeaddropSelected={this.state.isDeaddropSelected}
                    onMarkerSelect={this.handleMarkerSelect}
                    backToMap={this.backToMap.bind(this)}
                />
            </div>
            <div className="col-span-1 lg:col-span-3 md:rounded-l-xl">
                <Leaflet
                    ref={this.mapRef}
                    className="h-full"
                    {...this.state}
                    onZoomEnd={this.handleZoomEnd}
                    onMoveEnd={this.handleMoveEnd}
                    onMarkerSelect={this.handleMarkerSelect}
                />
            </div>
        </div>)
    }
}
