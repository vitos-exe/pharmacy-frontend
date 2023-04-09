import { createElementAndDoStuff } from '../Utils.js';
import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(errorTitle, errorCode, errorMessage) {
        super(errorTitle);
        this.errorContainer = createElementAndDoStuff('div', 'container');

        const backHomeLink = createElementAndDoStuff('a', 'error-link', 'Go back to homepage');
        backHomeLink.href = '\\';

        this.errorContainer.append(
            createElementAndDoStuff('h1', 'error-title', errorCode),
            createElementAndDoStuff('p', 'error-message', errorMessage),
            backHomeLink,
        );
    }

    async render() {
        document.querySelector('main').appendChild(this.errorContainer);
    }

    static getNotFoundView() {
        return new this(
            'Not found',
            404,
            'Oops! The page you are looking for could not be found.',
        );
    }

    static getNoAccessView() {
        return new this(
            'No access',
            403,
            "Oops! Seems like you don't have access to this page.",
        );
    }

    static getNotAuthorizedView() {
        return new this(
            'Not authorized',
            401,
            'Oops! Seems like you are not authorized.',
        );
    }
}
