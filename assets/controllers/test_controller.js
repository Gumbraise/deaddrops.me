import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    test(event) {
        event.preventDefault();
        console.log(event.detail);
    }
}
