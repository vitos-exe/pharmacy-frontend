import AbstractView from "./views/AbstractView.js";
import MedicineView from "./views/MedicineView.js";
import OrdersView from "./views/OrdersView.js";
import UsersView from "./views/UsersView.js";

const router = async () => {
    const routes = [
        { path: "/", view: MedicineView },
        { path: "/medicine", view: MedicineView },
        { path: "/orders", view: OrdersView },
        { path: "/users", view: UsersView }
    ];

    var match = routes.find(route => location.pathname === route.path)
    var view = match ? new match.view() : new NotFoundView();

    await view.render();
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href || e.target.parentNode.href); // buttons can also make you go back
        }
    });

    router()
});