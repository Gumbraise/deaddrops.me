import {Controller} from '@hotwired/stimulus';

export default class extends Controller {
    static values = {
        loading: String, listUrl: String, showUrl: String,
    };

    connect() {
        this.actualUrl = null;
        this.actualTab = 'list';
    }

    async showList(event) {
        event.preventDefault();

        if (this.actualTab === 'deaddrop' && !event.params.return) {
            return;
        }

        this.element.innerHTML = this.loadingValue;

        if (event.params.return) {
            this.dispatch('fetchMarkers');
        }

        this.actualTab = 'list';

        const response = await fetch(this.listUrlValue, {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(event.detail)
        });

        this.element.innerHTML = await response.text();
    }

    async showDeaddrop(event) {
        event.preventDefault();

        const url = event.detail.id ? this.showUrlValue.slice(0, -1) + event.detail.id : event.currentTarget.href;

        if (this.actualUrl === url) {
            return;
        }

        this.actualTab = 'deaddrop';

        const lat = event.detail.lat ?? event.params.lat;
        const lng = event.detail.lng ?? event.params.lng;

        this.dispatch('zoomTo', {detail: {lat, lng}});

        this.element.innerHTML = this.loadingValue;

        this.actualUrl = url;

        const response = await fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        this.element.innerHTML = await response.text();
    }
}
