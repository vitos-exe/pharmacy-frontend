import MedicineView from './views/MedicineView.js';
import OrdersView from './views/OrdersView.js';
import UsersView from './views/UsersView.js';
import ErrorView from './views/ErrorView.js';

const router = async () => {
    const routes = [
        { path: '/', view: MedicineView },
        { path: '/medicine', view: MedicineView },
        { path: '/orders', view: OrdersView },
        { path: '/users', view: UsersView },
    ];

    const match = routes.find((route) => location.pathname === route.path);

    let view = ErrorView.getNotFoundView();

    if (match) {
        try {
            view = new match.view();
        } catch (error) {
            const status = parseInt(error.message, 10);
            if (status === 403) {
                view = ErrorView.getNoAccessView();
            } else if (status === 401) {
                view = ErrorView.getNotAuthorizedView();
            }
        }
    }

    await view.render();
};

const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href || e.target.parentNode.href);
        }
    });
    router();
});
