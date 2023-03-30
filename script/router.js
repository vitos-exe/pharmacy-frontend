const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: () => console.log("/") },
        { path: "/log-in", view: () => console.log("/log-in") },
        { path: "/sing-up", view: () => console.log("/sing-up") }
    ];

    let match = routes.find(route => location.pathname === route.path)

    if (!match) {
        // 404 here
        match = routes[0]
    }

    match.view();
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