import MedicineView from "./views/MedicineView.js";
import OrdersView from "./views/OrdersView.js";
import UsersView from "./views/UsersView.js";

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: MedicineView },
        { path: "/medicine", view: MedicineView },
        { path: "/orders", view: OrdersView },
        { path: "/users", view: UsersView }
    ];

    let match = routes.find(route => location.pathname === route.path)

    if (!match) {
        match = { view: NotFoundView }
    }

    new match.view();

    // const view = new match.route.view(getParams(match));

    // document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router()
});