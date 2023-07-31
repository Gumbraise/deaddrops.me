import {Controller} from '@hotwired/stimulus';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {get as getDeadrops} from "../services/fetchDeaddrops";

export default class extends Controller {
    connect() {
        this.dragTimeout = null;
        this.markers = [];

        this.map = L.map(this.element, {
            center: [47, 0], zoom: 4,
        })

        this.map.on('zoomend', (event) => {
            this.fetchMarkers();
        });

        this.map.on('drag', (event) => {
            if (this.dragTimeout) {
                clearTimeout(this.dragTimeout);
            }

            this.dragTimeout = setTimeout(() => {
                this.fetchMarkers();
            }, 500);
        });

        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(this.map);

        this.myIcon = L.icon({
            iconUrl: markerIconPng,
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            popupAnchor: [0, -41],
            tooltipAnchor: [0, 0]
        });

        this.fetchMarkers();
    }

    async fetchMarkers() {
        const bounds = this.map.getBounds();

        const deadrops = await getDeadrops(bounds.getSouth(), bounds.getNorth(), bounds.getWest(), bounds.getEast())
            .then((r) => {
                this.markers.forEach(marker => this.map.removeLayer(marker));
                this.markers = [];

                this.dispatch('listDeaddrop', {detail: r});
                return r;
            });
        deadrops.forEach(deaddrop => {
            this.writeMarker(deaddrop.deaddropId, deaddrop.latitude, deaddrop.longitude);
        });
    }

    writeMarker(id, lat, long) {
        const marker = L.marker([lat, long], {icon: this.myIcon, id})
            .addTo(this.map)
            .on('click', (e) => {
                console.log(e.target.options.id)
                const disptach = this.dispatch('openDeaddrop', {detail: {id: e.target.options.id}});
                console.log(disptach)
            });

        this.markers.push(marker);
    }
}
