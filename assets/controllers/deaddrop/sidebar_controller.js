import {Controller} from '@hotwired/stimulus';

export default class extends Controller {
    static values = {
        listUrl: String,
    };

    async showList(event) {
        console.log(event.detail)
        const response = await fetch(this.listUrlValue, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event.detail)
        });

        this.element.innerHTML = await response.text();
    }
}
